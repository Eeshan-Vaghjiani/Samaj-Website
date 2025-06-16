# Script to rename event images
$originalImagesPath = "data\events\images\original"
$watermarkedImagesPath = "data\events\images\watermarked"

# Create array of event image names
$eventImages = @(
    "agm-2025.jpg",
    "youth-sports-2025.jpg",
    "diwali-2025.jpg",
    "business-networking-2025.jpg",
    "health-camp-2025.jpg",
    "women-entrepreneurship-2025.jpg",
    "youth-leadership-2025.jpg",
    "emergency-training-2025.jpg",
    "cooking-competition-2025.jpg",
    "career-fair-2025.jpg",
    "tree-planting-2025.jpg",
    "seniors-day-2025.jpg",
    "financial-seminar-2025.jpg",
    "blood-donation-2025.jpg",
    "children-art-2025.jpg"
)

# Get source images
$sourceImages = Get-ChildItem -Path $originalImagesPath -Filter "*.jpg" | Select-Object -First 15

# Rename and copy images
for ($i = 0; $i -lt [Math]::Min($eventImages.Count, $sourceImages.Count); $i++) {
    $sourcePath = $sourceImages[$i].FullName
    $destinationPath = Join-Path -Path $watermarkedImagesPath -ChildPath $eventImages[$i]
    
    Write-Host "Copying $sourcePath to $destinationPath"
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
}

Write-Host "Image renaming complete!" 