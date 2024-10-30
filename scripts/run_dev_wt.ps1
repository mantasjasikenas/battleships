# Script to open a new Windows Terminal window with 3 panes, one for the root folder, one for the backend folder and one for the frontend folder.

$script_path = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root_path = Split-Path -Parent $script_path
$backend_path = Join-Path $root_path "src\battleships-api"
$frontend_path = Join-Path $root_path "src\battleships-ui"

$frontend_command = "pnpm run start"
$backend_command = "dotnet watch"

wt.exe new-tab --title battleships pwsh -wd $root_path `; split-pane --title backend -H pwsh -wd $backend_path -Command $backend_command `; split-pane --title frontend -V pwsh -wd $frontend_path -Command $frontend_command
