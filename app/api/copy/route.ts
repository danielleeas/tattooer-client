import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get('text');

    if (!text) {
        return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }

    // Return an HTML page that copies the text to clipboard
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copy to Clipboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #05080F;
            color: #F0F0F0;
        }
        .container {
            text-align: center;
            padding: 20px;
        }
        .message {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .code {
            background-color: #1E293B;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 16px;
            word-break: break-all;
            margin: 20px 0;
            border: 1px solid #94A3B8;
        }
        .copied {
            color: #10B981;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="message">
            <p class="copied" id="status">Copied to clipboard!</p>
        </div>
        <div class="code" id="text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <p>You can close this window now.</p>
    </div>
    <script>
        (function() {
            const text = ${JSON.stringify(text)};
            
            // Try to copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    document.getElementById('status').textContent = 'Copied to clipboard!';
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                    document.getElementById('status').textContent = 'Click the code above to copy manually';
                    document.getElementById('status').classList.remove('copied');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    document.getElementById('status').textContent = 'Copied to clipboard!';
                } catch (err) {
                    console.error('Failed to copy:', err);
                    document.getElementById('status').textContent = 'Click the code above to copy manually';
                    document.getElementById('status').classList.remove('copied');
                }
                document.body.removeChild(textArea);
            }
            
            // Make the code selectable on click as fallback
            document.getElementById('text').addEventListener('click', function() {
                const range = document.createRange();
                range.selectNode(this);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            });
        })();
    </script>
</body>
</html>
    `;

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}

