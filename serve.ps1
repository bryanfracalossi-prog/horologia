# Servidor local do Horologia (sem instalar nada).
# Uso: clique com o botão direito > "Executar com PowerShell"
#      ou: powershell -ExecutionPolicy Bypass -File .\serve.ps1

param(
    [int]$Port = 8080,
    [switch]$NoBrowser
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mime = @{
    '.html'        = 'text/html; charset=utf-8'
    '.css'         = 'text/css; charset=utf-8'
    '.js'          = 'application/javascript; charset=utf-8'
    '.json'        = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.png'         = 'image/png'
    '.jpg'         = 'image/jpeg'
    '.svg'         = 'image/svg+xml'
    '.ico'         = 'image/x-icon'
    '.txt'         = 'text/plain; charset=utf-8'
}

$url = "http://localhost:$Port/"

try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
    $listener.Start()
}
catch {
    Write-Host "Nao foi possivel abrir a porta $Port. Ela ja esta em uso?" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "  Horologia - servidor local" -ForegroundColor Yellow
Write-Host "  Pasta: $root"
Write-Host "  No PC:      $url" -ForegroundColor Cyan
Write-Host ""

$lanIp = $null
try {
    $lanIp = (Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
        Select-Object -First 1).IPAddress
}
catch { }

if ($lanIp) {
    Write-Host "  No celular (mesmo Wi-Fi): http://${lanIp}:$Port/" -ForegroundColor Cyan
    Write-Host "  Dica: no Chrome do celular, menu > 'Adicionar a tela inicial'." -ForegroundColor DarkGray
}
else {
    Write-Host "  (Nao encontrei o IP da rede local para acesso pelo celular.)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "  Deixe esta janela aberta. Ctrl+C para parar." -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) { Start-Process $url | Out-Null }

while ($true) {
    $client = $null
    try {
        $client = $listener.AcceptTcpClient()
        $client.ReceiveTimeout = 5000
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 2048, $true)

        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

        while ($true) {
            $line = $reader.ReadLine()
            if ([string]::IsNullOrEmpty($line)) { break }
            if ($line.Length -gt 8192) { break }
        }

        $parts = $requestLine.Split(' ')
        $method = $parts[0]
        $rawPath = if ($parts.Length -gt 1) { $parts[1] } else { '/' }

        $status = '200 OK'
        $body = $null
        $contentType = 'text/plain; charset=utf-8'

        if ($method -ne 'GET' -and $method -ne 'HEAD') {
            $status = '405 Method Not Allowed'
            $body = [System.Text.Encoding]::UTF8.GetBytes('Metodo nao suportado')
        }
        else {
            $path = [System.Uri]::UnescapeDataString($rawPath.Split('?')[0])
            if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }

            $relative = $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $full = [System.IO.Path]::GetFullPath((Join-Path $root $relative))

            if (-not $full.StartsWith([System.IO.Path]::GetFullPath($root))) {
                $status = '403 Forbidden'
                $body = [System.Text.Encoding]::UTF8.GetBytes('Acesso negado')
            }
            elseif (Test-Path -LiteralPath $full -PathType Container) {
                $full = Join-Path $full 'index.html'
                if (-not (Test-Path -LiteralPath $full)) {
                    $status = '404 Not Found'
                    $body = [System.Text.Encoding]::UTF8.GetBytes('Nao encontrado')
                }
            }

            if (-not $body -and (Test-Path -LiteralPath $full -PathType Leaf)) {
                $body = [System.IO.File]::ReadAllBytes($full)
                $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
                if ($mime.ContainsKey($ext)) { $contentType = $mime[$ext] }
            }
            elseif (-not $body) {
                $status = '404 Not Found'
                $body = [System.Text.Encoding]::UTF8.GetBytes('Nao encontrado')
            }
        }

        $bytes = $body
        if (-not $bytes) { $bytes = [byte[]]@() }

        $header = "HTTP/1.1 $status`r`n" +
        "Content-Type: $contentType`r`n" +
        "Content-Length: $($bytes.Length)`r`n" +
        "Cache-Control: no-store, max-age=0`r`n" +
        "Connection: close`r`n" +
        "X-Content-Type-Options: nosniff`r`n`r`n"

        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        if ($method -ne 'HEAD' -and $bytes.Length -gt 0) {
            $stream.Write($bytes, 0, $bytes.Length)
        }
        $stream.Flush()

        $logLine = "{0}  {1}  {2}" -f (Get-Date -Format 'HH:mm:ss'), $status, $path
        Write-Host $logLine -ForegroundColor DarkGray
    }
    catch {
        # conexao interrompida: segue servindo
    }
    finally {
        if ($client) { try { $client.Close() } catch { } }
    }
}
