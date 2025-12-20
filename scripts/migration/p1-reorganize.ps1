# ============================================================================
# 🔧 MIGRATION P1 - Réorganisation Structure
# ============================================================================
# Exécuter depuis la racine du projet: .\scripts\migration\p1-reorganize.ps1
# ============================================================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ROOT

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🟠 MIGRATION P1 - RÉORGANISATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ============================================================================
# 1. CRÉATION DOSSIER ARCHIVE APPS
# ============================================================================
Write-Host "[1/5] Création apps/_archived/..." -ForegroundColor Yellow

$archivedPath = "apps/_archived"
if (-not (Test-Path $archivedPath)) {
    New-Item -Path $archivedPath -ItemType Directory | Out-Null
    Write-Host "   ✅ Dossier créé" -ForegroundColor Green
} else {
    Write-Host "   ⏭️  Existe déjà" -ForegroundColor Gray
}

# ============================================================================
# 2. DÉPLACEMENT APPS VIDES VERS ARCHIVE
# ============================================================================
Write-Host "`n[2/5] Archivage des 22 apps vides..." -ForegroundColor Yellow

$emptyApps = @(
    "agriculture-dz",
    "business-dz", 
    "commerce-dz",
    "council",
    "creative-studio",
    "dashboard-central",
    "data-dz-dashboard",
    "douanes-dz",
    "dzirvideo-ai",
    "education-dz",
    "finance-dz",
    "industrie-dz",
    "islam-dz",
    "legal-assistant",
    "pme-dz",
    "sante-dz",
    "seo-dz-boost",
    "transport-dz",
    "api-packages",
    "pipeline-creator"
)

$movedCount = 0
foreach ($app in $emptyApps) {
    $sourcePath = "apps/$app"
    $destPath = "$archivedPath/$app"
    
    if (Test-Path $sourcePath) {
        # Vérifier si c'est vraiment une app "vide" (seulement HTML basique)
        $pyFiles = Get-ChildItem -Path $sourcePath -Filter "*.py" -Recurse -ErrorAction SilentlyContinue
        $tsFiles = Get-ChildItem -Path $sourcePath -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
        $jsFiles = Get-ChildItem -Path $sourcePath -Filter "*.js" -Recurse -ErrorAction SilentlyContinue | 
                   Where-Object { $_.Name -notmatch "script\.js|main\.js" -or $_.Length -gt 5000 }
        
        if ($pyFiles.Count -eq 0 -and $tsFiles.Count -eq 0 -and $jsFiles.Count -eq 0) {
            Move-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "   📦 $app → _archived/" -ForegroundColor Gray
            $movedCount++
        } else {
            Write-Host "   ⚠️  $app contient du code, vérification manuelle requise" -ForegroundColor Yellow
        }
    }
}

Write-Host "   ✅ $movedCount apps archivées" -ForegroundColor Green

# ============================================================================
# 3. CONSOLIDATION DES DOSSIERS SHARED
# ============================================================================
Write-Host "`n[3/5] Consolidation shared/ → packages/shared/..." -ForegroundColor Yellow

$packagesPath = "packages"
$sharedTargetPath = "$packagesPath/shared"

# Créer structure packages/
if (-not (Test-Path $packagesPath)) {
    New-Item -Path $packagesPath -ItemType Directory | Out-Null
}

if (-not (Test-Path $sharedTargetPath)) {
    New-Item -Path $sharedTargetPath -ItemType Directory | Out-Null
}

$sharedSources = @(
    "apps/shared",
    "services/shared", 
    "shared"
)

foreach ($sharedSource in $sharedSources) {
    if (Test-Path $sharedSource) {
        $files = Get-ChildItem -Path $sharedSource -Recurse -File
        Write-Host "   📁 $sharedSource ($($files.Count) fichiers)" -ForegroundColor Gray
        
        # Créer sous-dossier pour éviter conflits
        $subFolder = $sharedSource -replace "/", "_" -replace "\\", "_"
        $targetSubPath = "$sharedTargetPath/$subFolder"
        
        if (-not (Test-Path $targetSubPath)) {
            Copy-Item -Path $sharedSource -Destination $targetSubPath -Recurse
            Write-Host "   → Copié vers packages/shared/$subFolder/" -ForegroundColor Gray
        }
    }
}

Write-Host "   ✅ Shared consolidé (originaux conservés pour migration graduelle)" -ForegroundColor Green

# ============================================================================
# 4. NETTOYAGE DOCKER-COMPOSE (analyse seulement)
# ============================================================================
Write-Host "`n[4/5] Analyse docker-compose files..." -ForegroundColor Yellow

$dockerPath = "infrastructure/docker"
$composeFiles = Get-ChildItem -Path $dockerPath -Filter "docker-compose*.yml" -ErrorAction SilentlyContinue

if ($composeFiles) {
    Write-Host "   📊 $($composeFiles.Count) fichiers docker-compose trouvés:" -ForegroundColor Gray
    
    $composeFiles | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 1)
        Write-Host "      • $($_.Name) ($size KB)" -ForegroundColor Gray
    }
    
    Write-Host "`n   📝 RECOMMANDATION: Consolider en 3 fichiers:" -ForegroundColor Yellow
    Write-Host "      • docker-compose.dev.yml (développement local)" -ForegroundColor White
    Write-Host "      • docker-compose.staging.yml (pré-production)" -ForegroundColor White  
    Write-Host "      • docker-compose.prod.yml (production VPS)" -ForegroundColor White
} else {
    Write-Host "   ⏭️  Aucun docker-compose trouvé dans $dockerPath" -ForegroundColor Gray
}

# ============================================================================
# 5. CORRECTION CONVENTIONS NOMMAGE (analyse)
# ============================================================================
Write-Host "`n[5/5] Analyse conventions nommage..." -ForegroundColor Yellow

# Trouver fichiers Python en kebab-case (devrait être snake_case)
$pythonKebab = Get-ChildItem -Path "." -Filter "*.py" -Recurse -ErrorAction SilentlyContinue | 
               Where-Object { $_.BaseName -match "-" -and $_.DirectoryName -notmatch "node_modules|\.venv|__pycache__|_archived" }

if ($pythonKebab.Count -gt 0) {
    Write-Host "   ⚠️  $($pythonKebab.Count) fichiers Python en kebab-case (devrait être snake_case):" -ForegroundColor Yellow
    $pythonKebab | Select-Object -First 10 | ForEach-Object {
        $newName = $_.BaseName -replace "-", "_"
        Write-Host "      • $($_.Name) → $newName.py" -ForegroundColor Gray
    }
    
    # Créer script de renommage
    $renameScript = @"
# Script de renommage automatique
# Exécuter manuellement après vérification

"@
    foreach ($file in $pythonKebab) {
        $newName = $file.BaseName -replace "-", "_"
        $newPath = Join-Path $file.DirectoryName "$newName.py"
        $renameScript += "git mv `"$($file.FullName)`" `"$newPath`"`n"
    }
    
    $renameScript | Out-File -FilePath "scripts/migration/rename-python-files.ps1" -Encoding utf8
    Write-Host "`n   📝 Script généré: scripts/migration/rename-python-files.ps1" -ForegroundColor Cyan
} else {
    Write-Host "   ✅ Conventions de nommage OK" -ForegroundColor Green
}

# ============================================================================
# RÉSUMÉ
# ============================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION P1 TERMINÉE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 Actions effectuées:" -ForegroundColor White
Write-Host "   • Dossier apps/_archived/ créé" -ForegroundColor Gray
Write-Host "   • $movedCount apps vides archivées" -ForegroundColor Gray
Write-Host "   • Shared consolidé dans packages/shared/" -ForegroundColor Gray
Write-Host "   • Analyse docker-compose effectuée" -ForegroundColor Gray
Write-Host "   • Script renommage Python généré" -ForegroundColor Gray

Write-Host "`n⚠️  ACTIONS MANUELLES REQUISES:" -ForegroundColor Yellow
Write-Host "   1. Vérifier apps marquées 'contient du code' avant archivage" -ForegroundColor White
Write-Host "   2. Consolider manuellement docker-compose (3 fichiers max)" -ForegroundColor White
Write-Host "   3. Exécuter rename-python-files.ps1 après vérification" -ForegroundColor White
Write-Host "   4. Mettre à jour imports après renommage" -ForegroundColor White

Write-Host "`n🔗 Prochaine étape: .\scripts\migration\p2-documentation.ps1" -ForegroundColor Cyan
