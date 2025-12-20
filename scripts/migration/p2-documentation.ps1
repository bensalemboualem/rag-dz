# ============================================================================
# 📝 MIGRATION P2 - Documentation & README Generator
# ============================================================================
# Exécuter depuis la racine du projet: .\scripts\migration\p2-documentation.ps1
# ============================================================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ROOT

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🟡 MIGRATION P2 - DOCUMENTATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ============================================================================
# TEMPLATE README
# ============================================================================
$ReadmeTemplate = @'
# {APP_NAME}

> {DESCRIPTION}

## 📋 Status

| Aspect | Status |
|--------|--------|
| **Production** | {STATUS} |
| **Tests** | {TESTS} |
| **Documentation** | ✅ |

## 🚀 Quick Start

```bash
# Installation
{INSTALL_CMD}

# Développement
{DEV_CMD}

# Build
{BUILD_CMD}
```

## 📁 Structure

```
{APP_NAME}/
├── {STRUCTURE}
```

## ⚙️ Configuration

Copier `.env.example` vers `.env` et configurer:

```env
# Variables requises
{ENV_VARS}
```

## 🔗 Liens

- [Documentation principale](../../docs/README.md)
- [Architecture](../../docs/ARCHITECTURE.md)
- [API](../../services/api/README.md)

---

*Généré automatiquement - IAFactory SaaS Platform*
'@

# ============================================================================
# 1. SCAN APPS SANS README
# ============================================================================
Write-Host "[1/4] Scan des apps sans README..." -ForegroundColor Yellow

$appsPath = "apps"
$appsWithoutReadme = @()

Get-ChildItem -Path $appsPath -Directory | Where-Object { $_.Name -ne "_archived" } | ForEach-Object {
    $readmePath = Join-Path $_.FullName "README.md"
    if (-not (Test-Path $readmePath)) {
        $appsWithoutReadme += $_
    }
}

Write-Host "   📊 $($appsWithoutReadme.Count) apps sans README" -ForegroundColor Gray

# ============================================================================
# 2. GÉNÉRATION README POUR CHAQUE APP
# ============================================================================
Write-Host "`n[2/4] Génération des README..." -ForegroundColor Yellow

$generatedCount = 0

foreach ($app in $appsWithoutReadme) {
    $appName = $app.Name
    $appPath = $app.FullName
    
    # Détecter le type d'app
    $hasPackageJson = Test-Path (Join-Path $appPath "package.json")
    $hasPyProject = Test-Path (Join-Path $appPath "pyproject.toml")
    $hasRequirements = Test-Path (Join-Path $appPath "requirements.txt")
    $hasNextConfig = Test-Path (Join-Path $appPath "next.config.*")
    $hasViteConfig = Test-Path (Join-Path $appPath "vite.config.*")
    
    # Déterminer stack
    $stack = "HTML/CSS/JS"
    $installCmd = "# Pas de dépendances"
    $devCmd = "# Ouvrir index.html dans un navigateur"
    $buildCmd = "# Pas de build requis"
    
    if ($hasNextConfig) {
        $stack = "Next.js"
        $installCmd = "npm install"
        $devCmd = "npm run dev"
        $buildCmd = "npm run build"
    } elseif ($hasViteConfig) {
        $stack = "React/Vite"
        $installCmd = "npm install"
        $devCmd = "npm run dev"
        $buildCmd = "npm run build"
    } elseif ($hasPackageJson) {
        $stack = "Node.js"
        $installCmd = "npm install"
        $devCmd = "npm start"
        $buildCmd = "npm run build"
    } elseif ($hasPyProject -or $hasRequirements) {
        $stack = "Python/FastAPI"
        $installCmd = "pip install -r requirements.txt"
        $devCmd = "uvicorn app.main:app --reload"
        $buildCmd = "# Pas de build (Python)"
    }
    
    # Générer structure
    $structure = Get-ChildItem -Path $appPath -Directory | 
                 Select-Object -First 5 | 
                 ForEach-Object { "├── $($_.Name)/" }
    $structure = ($structure -join "`n") + "`n└── ..."
    
    # Générer README
    $readme = $ReadmeTemplate
    $readme = $readme -replace "{APP_NAME}", $appName
    $readme = $readme -replace "{DESCRIPTION}", "Application $appName - IAFactory SaaS Platform ($stack)"
    $readme = $readme -replace "{STATUS}", "🟡 En développement"
    $readme = $readme -replace "{TESTS}", "❌ À implémenter"
    $readme = $readme -replace "{INSTALL_CMD}", $installCmd
    $readme = $readme -replace "{DEV_CMD}", $devCmd
    $readme = $readme -replace "{BUILD_CMD}", $buildCmd
    $readme = $readme -replace "{STRUCTURE}", $structure
    $readme = $readme -replace "{ENV_VARS}", "# Voir .env.example"
    
    $readmePath = Join-Path $appPath "README.md"
    $readme | Out-File -FilePath $readmePath -Encoding utf8
    
    Write-Host "   📝 $appName/README.md" -ForegroundColor Gray
    $generatedCount++
}

Write-Host "   ✅ $generatedCount README générés" -ForegroundColor Green

# ============================================================================
# 3. GÉNÉRATION .env.example
# ============================================================================
Write-Host "`n[3/4] Génération des .env.example..." -ForegroundColor Yellow

$envExampleTemplate = @'
# ============================================================================
# Configuration {APP_NAME}
# ============================================================================
# Copier ce fichier vers .env et remplir les valeurs

# API
API_URL=http://localhost:8000
API_KEY=your_api_key_here

# Base de données (si applicable)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# LLM (si applicable)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Environnement
NODE_ENV=development
DEBUG=true
'@

$envCreatedCount = 0

Get-ChildItem -Path $appsPath -Directory | Where-Object { $_.Name -ne "_archived" } | ForEach-Object {
    $envExamplePath = Join-Path $_.FullName ".env.example"
    $envPath = Join-Path $_.FullName ".env"
    $envLocalPath = Join-Path $_.FullName ".env.local"
    
    # Ne créer que si pas d'exemple existant et si config probable
    $hasPackageJson = Test-Path (Join-Path $_.FullName "package.json")
    $hasPython = Test-Path (Join-Path $_.FullName "requirements.txt")
    
    if ((-not (Test-Path $envExamplePath)) -and ($hasPackageJson -or $hasPython)) {
        $example = $envExampleTemplate -replace "{APP_NAME}", $_.Name
        $example | Out-File -FilePath $envExamplePath -Encoding utf8
        Write-Host "   📝 $($_.Name)/.env.example" -ForegroundColor Gray
        $envCreatedCount++
    }
}

Write-Host "   ✅ $envCreatedCount .env.example générés" -ForegroundColor Green

# ============================================================================
# 4. SCAN PROMPTS AGENTS À EXTERNALISER
# ============================================================================
Write-Host "`n[4/4] Scan prompts agents inline..." -ForegroundColor Yellow

$agentsPath = "agents"
$promptPatterns = @(
    'system_prompt\s*=\s*["""]',
    'SYSTEM_PROMPT\s*=\s*["""]',
    'prompt\s*=\s*f?["""][^"""]{100,}',
    'instructions\s*=\s*["""]'
)

$inlinePrompts = @()

Get-ChildItem -Path $agentsPath -Filter "*.py" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($pattern in $promptPatterns) {
        if ($content -match $pattern) {
            $inlinePrompts += $_.FullName
            break
        }
    }
}

if ($inlinePrompts.Count -gt 0) {
    Write-Host "   ⚠️  $($inlinePrompts.Count) fichiers avec prompts inline:" -ForegroundColor Yellow
    $inlinePrompts | Select-Object -First 10 | ForEach-Object {
        $relativePath = $_ -replace [regex]::Escape($ROOT), ""
        Write-Host "      • $relativePath" -ForegroundColor Gray
    }
    
    Write-Host "`n   📝 RECOMMANDATION: Externaliser vers agents/prompts/*.md" -ForegroundColor Cyan
} else {
    Write-Host "   ✅ Pas de prompts inline critiques détectés" -ForegroundColor Green
}

# ============================================================================
# RÉSUMÉ
# ============================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION P2 TERMINÉE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 Actions effectuées:" -ForegroundColor White
Write-Host "   • $generatedCount README.md générés" -ForegroundColor Gray
Write-Host "   • $envCreatedCount .env.example générés" -ForegroundColor Gray
Write-Host "   • $($inlinePrompts.Count) fichiers avec prompts inline identifiés" -ForegroundColor Gray

Write-Host "`n⚠️  ACTIONS MANUELLES REQUISES:" -ForegroundColor Yellow
Write-Host "   1. Personnaliser chaque README généré avec description réelle" -ForegroundColor White
Write-Host "   2. Adapter .env.example aux besoins spécifiques de chaque app" -ForegroundColor White
Write-Host "   3. Externaliser prompts agents vers fichiers .md" -ForegroundColor White

Write-Host "`n🔗 Prochaine étape: Voir docs/AUDIT.md pour P3 (tests & refactoring)" -ForegroundColor Cyan
