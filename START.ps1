# Deprecated launcher. Use the unified workflow instead:
#   npm run dev

Write-Host "This launcher is deprecated. Use: npm run dev"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm start"
        
        Write-Host "`n✅ Both processes started!" -ForegroundColor Green
        Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    }
    default {
        Write-Host "Exiting..." -ForegroundColor Yellow
    }
}
