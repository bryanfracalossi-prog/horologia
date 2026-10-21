Add-Type -AssemblyName System.Drawing

function New-HorologiaIcon {
  param(
    [int]$Size = 512,
    [double]$Scale = 1.0,
    [string]$Path
  )

  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $pearl = [System.Drawing.ColorTranslator]::FromHtml('#faf6ee')
  $gold = [System.Drawing.ColorTranslator]::FromHtml('#c9a227')
  $goldDark = [System.Drawing.ColorTranslator]::FromHtml('#8a6a1a')
  $goldLight = [System.Drawing.ColorTranslator]::FromHtml('#e2c98a')
  $white = [System.Drawing.ColorTranslator]::FromHtml('#fffdf8')
  $dark = [System.Drawing.ColorTranslator]::FromHtml('#2b251c')

  $g.Clear($pearl)

  # Centraliza e aplica a escala de segurança do ícone maskable.
  $cx = $Size / 2.0
  $cy = $Size / 2.0
  $u = ($Size / 512.0) * $Scale

  function S([double]$v) { return $v * $u }

  # Pulseira: elos externos dourados e centro branco.
  $strapW = S 132
  $strapInnerW = S 64
  $strapTopH = S 104
  $strapBottomY = $cy + (S 148)

  $g.FillRectangle((New-Object System.Drawing.SolidBrush($gold)), [single]($cx - $strapW/2), [single]($cy - (S 256)), [single]$strapW, [single]($strapTopH + (S 8)))
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($white)), [single]($cx - $strapInnerW/2), [single]($cy - (S 256)), [single]$strapInnerW, [single]($strapTopH + (S 8)))
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($gold)), [single]($cx - $strapW/2), [single]$strapBottomY, [single]$strapW, [single]($Size - $strapBottomY))
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($white)), [single]($cx - $strapInnerW/2), [single]$strapBottomY, [single]$strapInnerW, [single]($Size - $strapBottomY))

  # Coroa e botões.
  $crownBrush = New-Object System.Drawing.SolidBrush($gold)
  $g.FillRectangle($crownBrush, [single]($cx + (S 146)), [single]($cy - (S 24)), [single](S 34), [single](S 48))
  $g.FillRectangle($crownBrush, [single]($cx + (S 146)), [single]($cy + (S 42)), [single](S 24), [single](S 28))

  # Caixa dourada.
  $caseR = S 154
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($gold)), [single]($cx - $caseR), [single]($cy - $caseR), [single]($caseR * 2), [single]($caseR * 2))

  # Bisel com marcas de régua.
  $bezelR = S 143
  $bezelPen = New-Object System.Drawing.Pen($goldDark, [single](S 3))
  $bezelPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
  $bezelPen.DashPattern = [single[]]@(0.6, 2.2)
  $g.DrawEllipse($bezelPen, [single]($cx - $bezelR), [single]($cy - $bezelR), [single]($bezelR * 2), [single]($bezelR * 2))

  # Mostrador branco.
  $dialR = S 122
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($white)), [single]($cx - $dialR), [single]($cy - $dialR), [single]($dialR * 2), [single]($dialR * 2))
  $dialPen = New-Object System.Drawing.Pen($goldLight, [single](S 3))
  $g.DrawEllipse($dialPen, [single]($cx - $dialR), [single]($cy - $dialR), [single]($dialR * 2), [single]($dialR * 2))

  # 12 marcadores dourados.
  $tickPen = New-Object System.Drawing.Pen($gold, [single](S 7))
  $tickPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tickPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  for ($i = 0; $i -lt 12; $i++) {
    $angle = ($i * 30) * [Math]::PI / 180
    $r1 = S 104
    $r2 = S 114
    $x1 = $cx + [Math]::Sin($angle) * $r1
    $y1 = $cy - [Math]::Cos($angle) * $r1
    $x2 = $cx + [Math]::Sin($angle) * $r2
    $y2 = $cy - [Math]::Cos($angle) * $r2
    $g.DrawLine($tickPen, [single]$x1, [single]$y1, [single]$x2, [single]$y2)
  }

  # Nome no mostrador.
  $citizenFont = New-Object System.Drawing.Font('Arial', [single](S 17), [System.Drawing.FontStyle]::Bold)
  $citizenBrush = New-Object System.Drawing.SolidBrush($goldDark)
  $citizenFormat = New-Object System.Drawing.StringFormat
  $citizenFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $citizenFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString('CITIZEN', $citizenFont, $citizenBrush, [single]$cx, [single]($cy - (S 80)), $citizenFormat)

  # Display digital com C080.
  $lcdW = S 104
  $lcdH = S 46
  $lcdX = $cx - $lcdW / 2
  $lcdY = $cy + (S 37)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($dark)), [single]$lcdX, [single]$lcdY, [single]$lcdW, [single]$lcdH)
  $lcdPen = New-Object System.Drawing.Pen($goldLight, [single](S 2))
  $g.DrawRectangle($lcdPen, [single]$lcdX, [single]$lcdY, [single]$lcdW, [single]$lcdH)
  $lcdFont = New-Object System.Drawing.Font('Arial', [single](S 20), [System.Drawing.FontStyle]::Bold)
  $lcdBrush = New-Object System.Drawing.SolidBrush($goldLight)
  $g.DrawString('C080', $lcdFont, $lcdBrush, [single]($lcdX + $lcdW/2), [single]($lcdY + $lcdH/2), $citizenFormat)

  # Ponteiros dourados.
  $handPen = New-Object System.Drawing.Pen($goldDark, [single](S 9))
  $handPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $handPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine($handPen, [single]$cx, [single]$cy, [single]$cx, [single]($cy - (S 74)))
  $g.DrawLine($handPen, [single]$cx, [single]$cy, [single]($cx + (S 52)), [single]($cy + (S 36)))
  $centerR = S 10
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($goldDark)), [single]($cx - $centerR), [single]($cy - $centerR), [single]($centerR * 2), [single]($centerR * 2))

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$root = Split-Path -Parent $PSScriptRoot
$icons = Join-Path $root 'icons'

New-HorologiaIcon -Size 512 -Scale 1.0 -Path (Join-Path $icons 'icon-512.png')
New-HorologiaIcon -Size 192 -Scale 1.0 -Path (Join-Path $icons 'icon-192.png')
New-HorologiaIcon -Size 512 -Scale 0.78 -Path (Join-Path $icons 'icon-maskable-512.png')

Write-Output 'Ícones gerados.'
