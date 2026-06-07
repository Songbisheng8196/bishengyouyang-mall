Add-Type -AssemblyName System.Drawing

$dist = "D:\bisheng-youyang\frontend\dist\assets\images"

# Normal icons - pink background with white icon
$normalIcons = @(
    @{name="tab-home.png";     symbol=[char]0x2302},
    @{name="tab-category.png"; symbol=[char]0x2630},
    @{name="tab-cart.png";     symbol=[char]0x2665},
    @{name="tab-checkin.png";  symbol=[char]0x2713},
    @{name="tab-user.png";     symbol=[char]0x263A}
)

# Active icons - white background with pink icon
$activeIcons = @(
    @{name="tab-home-active.png";     symbol=[char]0x2302},
    @{name="tab-category-active.png"; symbol=[char]0x2630},
    @{name="tab-cart-active.png";     symbol=[char]0x2665},
    @{name="tab-checkin-active.png"; symbol=[char]0x2713},
    @{name="tab-user-active.png";     symbol=[char]0x263A}
)

function New-Icon($path, $bgR, $bgG, $bgB, $fgR, $fgG, $fgB, $symbol) {
    $bmp = New-Object System.Drawing.Bitmap(81, 81)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Background
    $bg = [System.Drawing.Color]::FromArgb($bgR, $bgG, $bgB)
    $g.Clear($bg)

    # Icon symbol
    $fg = [System.Drawing.Color]::FromArgb($fgR, $fgG, $fgB)
    $brush = New-Object System.Drawing.SolidBrush($fg)
    $font = New-Object System.Drawing.Font("Segoe UI Symbol", 32, [System.Drawing.FontStyle]::Bold)

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rect = New-Object System.Drawing.RectangleF(0, 0, 81, 81)
    $g.DrawString([string]$symbol, $font, $brush, $rect, $sf)

    $g.Dispose()
    $font.Dispose()
    $brush.Dispose()
    $sf.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $size = (Get-Item $path).Length
    $bmp.Dispose()
    return $size
}

foreach ($icon in $normalIcons) {
    $path = Join-Path $dist $icon.name
    $sz = New-Icon $path 234 167 139 255 255 255 $icon.symbol
    Write-Output "Normal  $($icon.name): $sz bytes"
}

foreach ($icon in $activeIcons) {
    $path = Join-Path $dist $icon.name
    $sz = New-Icon $path 255 255 255 234 167 139 $icon.symbol
    Write-Output "Active  $($icon.name): $sz bytes"
}

Write-Output "Done!"
