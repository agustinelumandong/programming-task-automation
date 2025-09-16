<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Programming Challenge</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4CAF50;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 28px;
        }
        .challenge-title {
            color: #2E7D32;
            font-size: 24px;
            margin: 20px 0 15px 0;
            text-align: center;
        }
        .challenge-meta {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .challenge-meta p {
            margin: 5px 0;
        }
        .description {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            margin: 20px 0;
        }
        .example {
            background-color: #f0f8f0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #45a049;
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .highlights {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .emoji {
            font-size: 1.2em;
        }
        @media (max-width: 480px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .challenge-title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🧠</span> Daily Programming Challenge</h1>
            <p style="margin: 0; color: #666;">{{challengeData.date}}</p>
        </div>

        <h2 class="challenge-title">{{challenge.title}}</h2>

        <div class="challenge-meta">
            <p><strong>Difficulty:</strong> <span style="text-transform: capitalize;">{{challenge.difficulty}}</span></p>
            <p><strong>Category:</strong> <span style="text-transform: capitalize;">{{challenge.category}}</span></p>
            <p><strong>Challenge ID:</strong> {{challengeData.id}}</p>
        </div>

        <div class="description">
            <h3><span class="emoji">📋</span> Challenge Description</h3>
            <p>{{challenge.description}}</p>
        </div>

        <div class="example">
            <h4><span class="emoji">💡</span> Example</h4>
            <p>{{challenge.example}}</p>
        </div>

        <div class="highlights">
            <h4><span class="emoji">🎯</span> What You'll Practice</h4>
            <ul>
                <li>{{challenge.category}} manipulation and algorithms</li>
                <li>Problem-solving and logical thinking</li>
                <li>Code optimization and complexity analysis</li>
                <li>Programming fundamentals</li>
            </ul>
        </div>

        <div class="cta-container">
            <a href="{{issueUrl}}" class="cta-button">
                <span class="emoji">🚀</span> View Challenge & Submit Solution
            </a>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4><span class="emoji">📝</span> How to Participate</h4>
            <ol>
                <li>Click the button above to view the full challenge</li>
                <li>Solve it in your preferred programming language</li>
                <li>Post your solution in the GitHub issue comments</li>
                <li>Share your approach and complexity analysis</li>
                <li>Review and learn from other solutions</li>
            </ol>
        </div>

        <div class="footer">
            <p><span class="emoji">🌟</span> <strong>Happy coding!</strong></p>
            <p>This is an automated email from your Daily Programming Challenge system.</p>
            <p>Challenge generated on {{challengeData.date}}</p>
            
            <div style="margin-top: 20px;">
                <p style="font-size: 12px; color: #999;">
                    You're receiving this because you subscribed to daily programming challenges.<br>
                    This challenge was automatically generated and curated for your learning.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
