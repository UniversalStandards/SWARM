Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

<#
Import legacy SWARM family repos into this unified repository using git subtree.

Usage:
  .\scripts\import_legacy.ps1

Requirements:
  - git
  - you have push access to this repo
  - you have read access to the source repos
#>

$RootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $RootDir

function Ensure-CleanTree {
  git diff --quiet | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Working tree not clean (unstaged changes).' }

  git diff --cached --quiet | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Working tree not clean (staged changes).' }
}

function Add-OrUpdateRemote([string]$Name, [string]$Url) {
  git remote get-url $Name 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    git remote set-url $Name $Url | Out-Null
  } else {
    git remote add $Name $Url | Out-Null
  }
}

function Import-Subtree([string]$Remote, [string]$Branch, [string]$Prefix) {
  Write-Host "`n=== Importing $Remote`:$Branch -> $Prefix ==="
  git fetch $Remote $Branch --tags | Out-Null

  if (Test-Path $Prefix) {
    git subtree pull --prefix $Prefix $Remote $Branch -m "chore(migration): subtree pull $Remote`:$Branch" | Out-Null
  } else {
    New-Item -ItemType Directory -Force -Path (Split-Path $Prefix) | Out-Null
    git subtree add --prefix $Prefix $Remote $Branch -m "chore(migration): subtree add $Remote`:$Branch" | Out-Null
  }
}

Ensure-CleanTree

$Repos = @(
  @{ remoteName='universal-standard-project-swarm'; remoteUrl='https://github.com/Universal-Standard/PROJECT-SWARM.git'; branch='main'; prefix='legacy/Universal-Standard/PROJECT-SWARM' },
  @{ remoteName='universal-standard-swarm';         remoteUrl='https://github.com/Universal-Standard/SWARM.git';         branch='main'; prefix='legacy/Universal-Standard/SWARM' }
)

Write-Host 'Starting legacy imports...'
foreach ($r in $Repos) {
  Add-OrUpdateRemote $r.remoteName $r.remoteUrl
  Import-Subtree $r.remoteName $r.branch $r.prefix
}

Write-Host "`nDone. Next steps:"
Write-Host "1) Review imported content under legacy/"
Write-Host "2) Relocate code into standardized layout (packages/, agents/, tools/, workflows/, eval/, infra/)"
Write-Host "3) Add redirect README stubs to legacy repos pointing to this unified repo"
