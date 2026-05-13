#!/usr/bin/env python3
"""Eventra Installation & Deployment Guide - PDF Generator"""

import os, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Register Fonts ──
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('LiberationSerif', normal='LiberationSerif', bold='LiberationSerif-Bold')
registerFontFamily('LiberationSans', normal='LiberationSans', bold='LiberationSans-Bold')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

# ── Palette ──
ACCENT       = colors.HexColor('#2695b9')
TEXT_PRIMARY  = colors.HexColor('#252321')
TEXT_MUTED    = colors.HexColor('#7a766f')
BG_SURFACE   = colors.HexColor('#e0ddd8')
BG_PAGE      = colors.HexColor('#f1f0ed')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# ── Styles ──
styles = getSampleStyleSheet()

cover_title = ParagraphStyle(
    'CoverTitle', fontName='LiberationSerif', fontSize=36, leading=44,
    alignment=TA_CENTER, textColor=ACCENT, spaceAfter=12
)
cover_sub = ParagraphStyle(
    'CoverSub', fontName='LiberationSerif', fontSize=16, leading=22,
    alignment=TA_CENTER, textColor=TEXT_MUTED, spaceAfter=8
)
cover_meta = ParagraphStyle(
    'CoverMeta', fontName='LiberationSerif', fontSize=12, leading=18,
    alignment=TA_CENTER, textColor=TEXT_MUTED, spaceAfter=6
)
h1_style = ParagraphStyle(
    'H1', fontName='LiberationSerif', fontSize=20, leading=26,
    textColor=ACCENT, spaceBefore=18, spaceAfter=10
)
h2_style = ParagraphStyle(
    'H2', fontName='LiberationSerif', fontSize=15, leading=20,
    textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=8
)
h3_style = ParagraphStyle(
    'H3', fontName='LiberationSerif', fontSize=12, leading=16,
    textColor=ACCENT, spaceBefore=10, spaceAfter=6
)
body_style = ParagraphStyle(
    'Body', fontName='LiberationSerif', fontSize=10.5, leading=17,
    alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY, spaceAfter=6
)
bullet_style = ParagraphStyle(
    'Bullet', fontName='LiberationSerif', fontSize=10.5, leading=17,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, leftIndent=20,
    bulletIndent=8, spaceAfter=4, bulletFontSize=10
)
code_style = ParagraphStyle(
    'Code', fontName='DejaVuSans', fontSize=9, leading=14,
    alignment=TA_LEFT, textColor=colors.HexColor('#1a1a2e'),
    backColor=colors.HexColor('#f4f4f8'), leftIndent=16,
    rightIndent=16, spaceBefore=6, spaceAfter=6,
    borderPadding=8
)
note_style = ParagraphStyle(
    'Note', fontName='LiberationSerif', fontSize=10, leading=16,
    alignment=TA_LEFT, textColor=ACCENT, leftIndent=16,
    borderPadding=8, spaceBefore=6, spaceAfter=6
)
header_cell = ParagraphStyle(
    'HeaderCell', fontName='LiberationSerif', fontSize=10, leading=14,
    alignment=TA_CENTER, textColor=TABLE_HEADER_TEXT
)
cell_style = ParagraphStyle(
    'Cell', fontName='LiberationSerif', fontSize=9.5, leading=14,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY
)
cell_center = ParagraphStyle(
    'CellCenter', fontName='LiberationSerif', fontSize=9.5, leading=14,
    alignment=TA_CENTER, textColor=TEXT_PRIMARY
)

def heading1(text):
    return Paragraph(f'<b>{text}</b>', h1_style)

def heading2(text):
    return Paragraph(f'<b>{text}</b>', h2_style)

def heading3(text):
    return Paragraph(f'<b>{text}</b>', h3_style)

def body(text):
    return Paragraph(text, body_style)

def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet>{text}', bullet_style)

def code(text):
    return Paragraph(text.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_style)

def note(text):
    return Paragraph(f'<b>Note:</b> {text}', note_style)

def make_table(headers, rows, col_ratios=None):
    available = A4[0] - 2 * inch
    n = len(headers)
    if col_ratios:
        col_widths = [r * available for r in col_ratios]
    else:
        col_widths = [available / n] * n
    
    data = [[Paragraph(f'<b>{h}</b>', header_cell) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cell_style) for c in row])
    
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def hr():
    return HRFlowable(width="100%", thickness=1, color=BG_SURFACE, spaceBefore=8, spaceAfter=8)

# ── Build Document ──
output = '/home/z/my-project/download/Eventra_Installation_Deployment_Guide.pdf'

doc = SimpleDocTemplate(
    output, pagesize=A4,
    leftMargin=1*inch, rightMargin=1*inch,
    topMargin=0.8*inch, bottomMargin=0.8*inch
)

story = []

# ═══════════════ COVER PAGE ═══════════════
story.append(Spacer(1, 2.2*inch))
story.append(Paragraph('<b>Eventra</b>', cover_title))
story.append(Spacer(1, 8))
story.append(Paragraph('Installation & Deployment Guide', cover_sub))
story.append(Spacer(1, 12))
story.append(HRFlowable(width="40%", thickness=2, color=ACCENT, spaceBefore=8, spaceAfter=8))
story.append(Spacer(1, 12))
story.append(Paragraph('Local Development on MacBook', cover_meta))
story.append(Paragraph('Production Deployment on Azure CyberPanel', cover_meta))
story.append(Spacer(1, 24))
story.append(Paragraph('Version 1.0 | May 2026', cover_meta))
story.append(Paragraph('Next.js 16 | Prisma | SQLite | Tailwind CSS', cover_meta))
story.append(PageBreak())

# ═══════════════ TABLE OF CONTENTS ═══════════════
story.append(Paragraph('<b>Table of Contents</b>', h1_style))
story.append(Spacer(1, 12))

toc_items = [
    ("1.", "Project Overview", "Architecture, tech stack, and folder structure"),
    ("2.", "Prerequisites", "Software requirements for local and server environments"),
    ("3.", "Local Setup on MacBook", "Step-by-step installation and development workflow"),
    ("4.", "Seeding the Database", "Populating initial content for the website"),
    ("5.", "Admin Panel Access", "Logging in and managing website content"),
    ("6.", "Deployment on Azure CyberPanel", "Production server setup with PM2 and Nginx"),
    ("7.", "Environment Variables", "Configuration reference for all environments"),
    ("8.", "Troubleshooting", "Common issues and their solutions"),
    ("9.", "Security Checklist", "Production security hardening guide"),
]

for num, title, desc in toc_items:
    story.append(Paragraph(f'<b>{num} {title}</b>', body_style))
    story.append(Paragraph(f'{desc}', ParagraphStyle('tocdesc', parent=body_style, textColor=TEXT_MUTED, leftIndent=20, spaceAfter=8)))

story.append(PageBreak())

# ═══════════════ SECTION 1: PROJECT OVERVIEW ═══════════════
story.append(heading1('1. Project Overview'))
story.append(body('Eventra is a full-stack event management website built with modern web technologies. It features a public-facing multi-page website with a Rose/Gold/Champagne color palette targeting the Nepali market, along with a comprehensive admin panel for managing all website content dynamically without touching code. The platform supports wedding planning, corporate events, and private party services, complete with portfolio galleries, testimonials, pricing packages, and an inquiry management system.'))

story.append(heading2('1.1 Tech Stack'))
story.append(make_table(
    ['Technology', 'Purpose', 'Version'],
    [
        ['Next.js', 'Full-stack React framework (App Router)', '16.x'],
        ['TypeScript', 'Type-safe JavaScript', '5.x'],
        ['Tailwind CSS', 'Utility-first CSS framework', '4.x'],
        ['shadcn/ui', 'UI component library', 'Latest'],
        ['Prisma ORM', 'Database ORM', '6.x'],
        ['SQLite', 'Embedded database', '3.x'],
        ['Node.js', 'JavaScript runtime', '18+ / 20+'],
        ['Bun (optional)', 'Fast JS runtime alternative', '1.x'],
    ],
    col_ratios=[0.25, 0.50, 0.25]
))
story.append(Spacer(1, 12))

story.append(heading2('1.2 Project Folder Structure'))
story.append(body('Understanding the project structure is essential for making modifications and troubleshooting issues. Below is a summary of the key directories and their purposes within the Eventra project.'))
story.append(code(
    'eventra/\n'
    '&nbsp;&nbsp;prisma/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;schema.prisma&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Database models\n'
    '&nbsp;&nbsp;public/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;images/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Static images\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;uploads/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Admin uploads\n'
    '&nbsp;&nbsp;src/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;app/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Hash-based router\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Root layout\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;globals.css&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Brand colors\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# REST API routes\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hero/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;services/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;portfolio/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;testimonials/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pricing/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;about/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;contact-info/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inquiries/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;admin/login/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;admin/verify/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seed/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;upload/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;settings/route.ts\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;components/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;navbar.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Navigation bar\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;footer.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Footer component\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pages/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Public pages\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;admin/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Admin components\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ui/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# shadcn/ui components\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;lib/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;db.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Prisma client\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Frontend API helpers\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;types.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# TypeScript types\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;utils.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Utility functions\n'
    '&nbsp;&nbsp;db/\n'
    '&nbsp;&nbsp;&nbsp;&nbsp;custom.db&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# SQLite database file\n'
    '&nbsp;&nbsp;.env&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Environment variables\n'
    '&nbsp;&nbsp;package.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Dependencies & scripts\n'
))

# ═══════════════ SECTION 2: PREREQUISITES ═══════════════
story.append(heading1('2. Prerequisites'))
story.append(body('Before installing Eventra, ensure your system meets the following software requirements. The project relies on Node.js for running the Next.js development server and build process, a package manager (npm or bun) for dependency installation, and Git for version control. Prisma CLI is used for database schema management and comes bundled as a project dependency.'))

story.append(heading2('2.1 For Local MacBook Development'))
story.append(make_table(
    ['Software', 'Minimum Version', 'Recommended Version', 'Install Method'],
    [
        ['Node.js', '18.x', '20.x LTS', 'brew install node or nvm install 20'],
        ['npm', '9.x', '10.x', 'Comes with Node.js'],
        ['Git', '2.x', 'Latest', 'brew install git'],
        ['Bun (optional)', '1.x', 'Latest', 'curl -fsSL https://bun.sh/install | bash'],
    ],
    col_ratios=[0.20, 0.18, 0.22, 0.40]
))
story.append(Spacer(1, 8))

story.append(heading2('2.2 For Azure CyberPanel Server'))
story.append(make_table(
    ['Software', 'Minimum Version', 'Purpose', 'Install Method'],
    [
        ['Node.js', '18.x', 'Runtime for Next.js', 'nvm install 20 or NodeSource repo'],
        ['npm', '9.x', 'Package manager', 'Comes with Node.js'],
        ['PM2', '5.x', 'Process manager', 'npm install -g pm2'],
        ['Nginx', '1.18+', 'Reverse proxy', 'CyberPanel includes this'],
        ['Git', '2.x', 'Code deployment', 'apt install git'],
    ],
    col_ratios=[0.20, 0.18, 0.27, 0.35]
))
story.append(Spacer(1, 8))
story.append(note('CyberPanel comes with Nginx (OpenLiteSpeed) pre-installed. You may use either Nginx or OpenLiteSpeed as the reverse proxy. This guide covers the Nginx approach as it is more commonly documented and widely supported by the community.'))

# ═══════════════ SECTION 3: LOCAL SETUP ON MACBOOK ═══════════════
story.append(heading1('3. Local Setup on MacBook'))
story.append(body('This section walks you through the complete process of setting up the Eventra project on your MacBook for local development. The process involves cloning the project, installing dependencies, configuring the database, and starting the development server. Each step is designed to be executed in your Terminal application.'))

story.append(heading2('3.1 Step 1 - Open Terminal and Navigate to Your Projects Directory'))
story.append(body('Open the Terminal application on your MacBook (you can find it in Applications > Utilities > Terminal, or search using Spotlight with Cmd+Space). Navigate to the directory where you want to store the project. A common choice is the Projects folder in your home directory.'))
story.append(code('cd ~/Projects'))

story.append(heading2('3.2 Step 2 - Extract or Clone the Project'))
story.append(body('If you downloaded the project as a ZIP archive, extract it to your desired location. If using Git, clone the repository instead. The project folder should be named "my-project" or "eventra" depending on how it was packaged.'))
story.append(code('# If downloaded as ZIP:\nunzip eventra.zip -d ~/Projects/eventra\ncd ~/Projects/eventra\n\n# If using Git:\ngit clone &lt;your-repo-url&gt; ~/Projects/eventra\ncd ~/Projects/eventra'))

story.append(heading2('3.3 Step 3 - Install Node.js (if not already installed)'))
story.append(body('Node.js is the runtime that powers Next.js. The recommended approach for managing Node.js versions on macOS is using nvm (Node Version Manager), which allows you to install and switch between multiple Node.js versions easily. Alternatively, you can install Node.js directly via Homebrew.'))
story.append(code('# Option A: Using nvm (recommended)\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash\nsource ~/.zshrc\nnvm install 20\nnvm use 20\n\n# Option B: Using Homebrew\nbrew install node@20'))
story.append(body('After installation, verify Node.js and npm are available by running the following commands. You should see version numbers printed in the terminal output confirming the installation was successful.'))
story.append(code('node --version&nbsp;&nbsp;&nbsp;# Should show v20.x.x\nnpm --version&nbsp;&nbsp;&nbsp;&nbsp;# Should show 10.x.x'))

story.append(heading2('3.4 Step 4 - Install Project Dependencies'))
story.append(body('Navigate to the project root directory and install all the npm dependencies. This step downloads all the packages listed in package.json, including Next.js, React, Prisma, Tailwind CSS, shadcn/ui components, and all other libraries the project requires. This process may take 1-3 minutes depending on your internet connection speed.'))
story.append(code('cd ~/Projects/eventra\nnpm install'))
story.append(note('If you have Bun installed, you can use "bun install" instead of "npm install" for faster installation. Bun is a drop-in replacement that typically installs dependencies 3-5 times faster than npm.'))

story.append(heading2('3.5 Step 5 - Configure Environment Variables'))
story.append(body('The project uses a .env file at the root to store configuration. The most critical variable is DATABASE_URL, which tells Prisma where to find the SQLite database file. Since SQLite uses a file path as the connection string, you need to update this path to match your local project location.'))
story.append(code('# Create or edit the .env file in the project root:\nnano .env\n\n# Add the following line (adjust the path to your actual project location):\nDATABASE_URL=file:/Users/YOUR_USERNAME/Projects/eventra/db/custom.db'))
story.append(body('Replace "YOUR_USERNAME" with your actual macOS username. The database file "custom.db" will be created automatically when you run the Prisma push command in the next step. You do not need to create it manually.'))

story.append(heading2('3.6 Step 6 - Initialize the Database'))
story.append(body('Prisma needs to create the database schema and generate the client library. The "db push" command reads the Prisma schema file and creates all the necessary tables in the SQLite database. The "generate" command creates the TypeScript client that your application code uses to interact with the database.'))
story.append(code('npx prisma db push\nnpx prisma generate'))
story.append(body('After running these commands, you should see a "custom.db" file in the "db/" directory, and the Prisma client will be generated in "node_modules/@prisma/client". The terminal output should confirm that the schema was successfully pushed and the client was generated without errors.'))

story.append(heading2('3.7 Step 7 - Seed the Database with Initial Content'))
story.append(body('The project includes a seed API that populates the database with default content including hero slides, services, portfolio items, testimonials, pricing packages, contact information, and site settings. You need to start the dev server first, then call the seed endpoint.'))
story.append(code('# Start the development server\nnpm run dev\n\n# In a separate terminal window, seed the database:\ncurl -X POST http://localhost:3000/api/seed'))
story.append(body('You should see a response: {"message":"Database seeded successfully!"}. This only needs to be done once. If the database already has content, the seed endpoint safely skips re-seeding without duplicating data, so it is safe to call it multiple times.'))

story.append(heading2('3.8 Step 8 - Access the Website'))
story.append(body('With the development server running, open your web browser and navigate to the following URLs to access different parts of the application. The development server supports hot module replacement (HMR), so any changes you make to the source code will be reflected in the browser automatically without needing to restart the server.'))
story.append(make_table(
    ['Page', 'URL', 'Description'],
    [
        ['Homepage', 'http://localhost:3000', 'Hero carousel, services, testimonials, CTA'],
        ['About', 'http://localhost:3000#/about', 'Company story and features'],
        ['Services', 'http://localhost:3000#/services', 'Wedding, Corporate, Parties'],
        ['Portfolio', 'http://localhost:3000#/portfolio', 'Filterable image gallery'],
        ['Testimonials', 'http://localhost:3000#/testimonials', 'Client reviews'],
        ['Pricing', 'http://localhost:3000#/pricing', '3-tier pricing packages'],
        ['Contact', 'http://localhost:3000#/contact', 'Inquiry form + WhatsApp/Viber'],
        ['Admin Login', 'http://localhost:3000#/admin/login', 'Admin panel authentication'],
        ['Admin Dashboard', 'http://localhost:3000#/admin', 'Content management home'],
    ],
    col_ratios=[0.20, 0.35, 0.45]
))
story.append(Spacer(1, 8))
story.append(note('The website uses hash-based routing (e.g., #/about instead of /about). This means all pages are served from the single page.tsx entry point, and navigation happens client-side without full page reloads. Bookmarking any hash URL will work correctly when you revisit it.'))

# ═══════════════ SECTION 4: SEEDING THE DATABASE ═══════════════
story.append(heading1('4. Seeding the Database'))
story.append(body('Database seeding is the process of populating your database with initial data. The Eventra project includes a comprehensive seed endpoint that creates all the default content needed for the website to display properly. Without seeding, the website will show loading skeletons instead of actual content. This section explains what data gets seeded and how to manage the seeding process.'))

story.append(heading2('4.1 What Gets Seeded'))
story.append(make_table(
    ['Data Type', 'Count', 'Details'],
    [
        ['Hero Slides', '3', 'Rotating banner images with titles and subtitles'],
        ['About Content', '1', 'Company description, features, and images'],
        ['Services', '3', 'Wedding Planning, Corporate Events, Private Parties'],
        ['Portfolio Items', '9', 'Gallery images across 3 categories'],
        ['Testimonials', '4', 'Client reviews with star ratings'],
        ['Pricing Packages', '3', 'Basic (NPR 25K), Standard (NPR 55K), Premium (NPR 95K)'],
        ['Contact Info', '1', 'Phone, email, address, WhatsApp, Viber'],
        ['Site Settings', '2', 'Brand name and tagline'],
    ],
    col_ratios=[0.25, 0.12, 0.63]
))
story.append(Spacer(1, 8))

story.append(heading2('4.2 Resetting the Database'))
story.append(body('If you need to start fresh with a clean database (for example, after making schema changes or if the data becomes corrupted), you can reset the database completely. This will delete all existing data and recreate the schema from scratch. After resetting, you must run the seed endpoint again to populate the database with default content.'))
story.append(code('# Delete the existing database file\nrm db/custom.db\n\n# Recreate the schema\nnpx prisma db push\nnpx prisma generate\n\n# Restart the dev server, then seed:\nnpm run dev\ncurl -X POST http://localhost:3000/api/seed'))

# ═══════════════ SECTION 5: ADMIN PANEL ═══════════════
story.append(heading1('5. Admin Panel Access'))
story.append(body('The admin panel allows you to manage all website content through a user-friendly interface without needing to modify any code or database entries directly. You can add, edit, and delete hero slides, services, portfolio items, testimonials, pricing packages, contact information, and site settings. The admin panel also provides a dashboard for viewing and managing customer inquiries submitted through the contact form.'))

story.append(heading2('5.1 Login Credentials'))
story.append(make_table(
    ['Field', 'Value'],
    [
        ['URL', 'http://localhost:3000#/admin/login'],
        ['Email', 'admin@eventra.com'],
        ['Password', 'admin123'],
    ],
    col_ratios=[0.30, 0.70]
))
story.append(Spacer(1, 8))
story.append(note('The default credentials are hardcoded for development purposes. For production deployment, you MUST change these credentials by modifying the file src/app/api/admin/login/route.ts. This is a critical security requirement before making the site publicly accessible.'))

story.append(heading2('5.2 Admin Panel Sections'))
story.append(body('Once logged in, the admin panel provides access to the following sections. Each section allows full CRUD (Create, Read, Update, Delete) operations on the corresponding data. Changes made in the admin panel are immediately reflected on the public website, so there is no need to restart the server or rebuild the application.'))
story.append(bullet('<b>Dashboard</b> - Overview of all content counts and recent inquiries'))
story.append(bullet('<b>Hero Slides</b> - Manage the rotating banner images, titles, and subtitles on the homepage'))
story.append(bullet('<b>Services</b> - Add, edit, or remove service offerings with descriptions, icons, and feature lists'))
story.append(bullet('<b>Portfolio</b> - Upload and manage gallery images with category filtering'))
story.append(bullet('<b>Testimonials</b> - Manage client reviews, star ratings, and display order'))
story.append(bullet('<b>Pricing</b> - Edit pricing tiers, features, and "most popular" badge placement'))
story.append(bullet('<b>Inquiries</b> - View, respond to, and manage customer inquiries from the contact form'))
story.append(bullet('<b>Contact Info</b> - Update phone, email, address, WhatsApp, and Viber numbers'))
story.append(bullet('<b>Settings</b> - Change brand name, tagline, and other site-wide settings'))

story.append(heading2('5.3 Image Uploads'))
story.append(body('The admin panel supports image uploads for hero slides, services, and portfolio items. Uploaded images are stored in the "public/uploads/" directory and served statically by Next.js. The supported formats include JPG, PNG, GIF, and WebP. For optimal performance, images should be resized to appropriate dimensions before uploading: hero slides should be approximately 1920x1080 pixels, service thumbnails around 800x600 pixels, and portfolio images between 800x600 and 1200x800 pixels.'))

# ═══════════════ SECTION 6: DEPLOYMENT ON AZURE CYBERPANEL ═══════════════
story.append(heading1('6. Deployment on Azure CyberPanel'))
story.append(body('Deploying Eventra to an Azure Virtual Machine running CyberPanel involves building the Next.js application for production, setting up a process manager to keep the application running, and configuring a reverse proxy (Nginx or OpenLiteSpeed) to route web traffic to your application. This section provides a complete step-by-step guide for production deployment, covering server preparation through to going live.'))

story.append(heading2('6.1 Step 1 - Provision an Azure VM'))
story.append(body('Create an Azure Virtual Machine with the following recommended specifications. The application is lightweight thanks to SQLite and the standalone Next.js output, so a basic VM is sufficient for moderate traffic. For high-traffic scenarios, consider upgrading to a larger instance with more CPU cores and RAM.'))
story.append(make_table(
    ['Specification', 'Minimum', 'Recommended'],
    [
        ['OS', 'Ubuntu 22.04 LTS', 'Ubuntu 24.04 LTS'],
        ['CPU', '1 vCPU', '2 vCPU'],
        ['RAM', '1 GB', '2 GB'],
        ['Storage', '20 GB SSD', '40 GB SSD'],
        ['CyberPanel', 'Free version', 'Free version'],
    ],
    col_ratios=[0.30, 0.35, 0.35]
))
story.append(Spacer(1, 8))

story.append(heading2('6.2 Step 2 - Install CyberPanel'))
story.append(body('If CyberPanel is not already installed on your Azure VM, you can install it using the official installer script. CyberPanel provides a web-based control panel that simplifies server management, including website creation, SSL certificate management, and email configuration. The installation process typically takes 10-20 minutes depending on server performance.'))
story.append(code('# SSH into your Azure VM\nssh azureuser@YOUR_VM_IP\n\n# Run the CyberPanel installer\nsh &lt;(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)'))
story.append(body('Follow the on-screen prompts to complete the CyberPanel installation. The installer will automatically set up OpenLiteSpeed, MariaDB, and other necessary components. After installation, access the CyberPanel dashboard at https://YOUR_VM_IP:8090 with the default admin credentials (admin / 1234567 - change this immediately after first login).'))

story.append(heading2('6.3 Step 3 - Install Node.js and PM2 on the Server'))
story.append(body('SSH into your server and install Node.js using nvm (Node Version Manager), which provides the most flexible and reliable Node.js installation on Linux servers. Then install PM2, a production-grade process manager that will keep your Next.js application running continuously, automatically restarting it if it crashes and providing monitoring capabilities.'))
story.append(code('# Install nvm\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash\nsource ~/.bashrc\n\n# Install Node.js 20\nnvm install 20\nnvm use 20\nnvm alias default 20\n\n# Install PM2 globally\nnpm install -g pm2'))
story.append(body('Verify the installations are successful by checking the version numbers. Both node and pm2 commands should return valid version strings confirming they are properly installed and accessible in your system PATH.'))
story.append(code('node --version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# v20.x.x\npm2 --version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 5.x.x'))

story.append(heading2('6.4 Step 4 - Upload Project Files'))
story.append(body('Transfer the project files from your MacBook to the Azure server. The recommended approach is using Git for deployment, which provides version control and easy updates. Alternatively, you can use SCP or rsync for direct file transfer. The project should be placed in a dedicated directory on the server, such as /home/eventra/ or /var/www/eventra/.'))
story.append(code('# Option A: Using Git (recommended)\nssh azureuser@YOUR_VM_IP\nmkdir -p /home/eventra\ncd /home/eventra\ngit clone &lt;your-repo-url&gt; .\n\n# Option B: Using SCP from your MacBook\nscp -r ~/Projects/eventra azureuser@YOUR_VM_IP:/home/eventra/\n\n# Option C: Using rsync (best for updates)\nrsync -avz --exclude node_modules --exclude .next \\\n&nbsp;&nbsp;~/Projects/eventra/ azureuser@YOUR_VM_IP:/home/eventra/'))

story.append(heading2('6.5 Step 5 - Install Dependencies and Build'))
story.append(body('On the server, navigate to the project directory and install the production dependencies. Then build the Next.js application for production using the build script defined in package.json. The build process compiles TypeScript, optimizes CSS and JavaScript, and creates a standalone output in the .next/standalone/ directory that includes everything needed to run the application.'))
story.append(code('cd /home/eventra\nnpm install\n\n# Configure environment\nnano .env\n# Set: DATABASE_URL=file:/home/eventra/db/custom.db\n\n# Initialize database\nnpx prisma db push\nnpx prisma generate\n\n# Build for production\nnpm run build'))
story.append(note('The build command ("next build") also copies static files and the public directory into the standalone output. The standalone output is optimized for production and includes only the necessary files, resulting in a smaller deployment footprint compared to running the full development setup.'))

story.append(heading2('6.6 Step 6 - Seed the Database on the Server'))
story.append(body('After building the application, you need to seed the database with initial content. Start the server temporarily to call the seed endpoint, then stop it. This only needs to be done once during initial setup.'))
story.append(code('# Start the server temporarily in the background\nNODE_ENV=production node .next/standalone/server.js &\n\n# Wait a moment for the server to start, then seed:\nsleep 5\ncurl -X POST http://localhost:3000/api/seed\n\n# Stop the temporary server\nkill %1'))

story.append(heading2('6.7 Step 7 - Configure PM2 Process Manager'))
story.append(body('PM2 ensures your Next.js application runs continuously in production, automatically restarting if it crashes and providing log management. Create a PM2 ecosystem configuration file that defines how your application should be run, including environment variables and startup settings.'))
story.append(code('# Create PM2 ecosystem file\ncat &lt;&lt; \'EOF\' > /home/eventra/ecosystem.config.js\nmodule.exports = {\n&nbsp;&nbsp;apps: [{\n&nbsp;&nbsp;&nbsp;&nbsp;name: \'eventra\',\n&nbsp;&nbsp;&nbsp;&nbsp;script: \'.next/standalone/server.js\',\n&nbsp;&nbsp;&nbsp;&nbsp;cwd: \'/home/eventra\',\n&nbsp;&nbsp;&nbsp;&nbsp;env: {\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NODE_ENV: \'production\',\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PORT: 3000,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATABASE_URL: \'file:/home/eventra/db/custom.db\',\n&nbsp;&nbsp;&nbsp;&nbsp;},\n&nbsp;&nbsp;&nbsp;&nbsp;instances: 1,\n&nbsp;&nbsp;&nbsp;&nbsp;autorestart: true,\n&nbsp;&nbsp;&nbsp;&nbsp;watch: false,\n&nbsp;&nbsp;&nbsp;&nbsp;max_memory_restart: \'500M\',\n&nbsp;&nbsp;&nbsp;&nbsp;error_file: \'/home/eventra/logs/error.log\',\n&nbsp;&nbsp;&nbsp;&nbsp;out_file: \'/home/eventra/logs/out.log\',\n&nbsp;&nbsp;&nbsp;&nbsp;log_date_format: \'YYYY-MM-DD HH:mm:ss\',\n&nbsp;&nbsp;}]\n};\nEOF\n\n# Create logs directory\nmkdir -p /home/eventra/logs\n\n# Start the application with PM2\ncd /home/eventra\npm2 start ecosystem.config.js\n\n# Verify it is running\npm2 status\npm2 logs eventra --lines 20'))
story.append(body('To ensure PM2 automatically restarts your application when the server reboots, save the PM2 process list and generate a startup script. This creates a system service that launches PM2 and all its managed processes on system boot.'))
story.append(code('# Save PM2 process list\npm2 save\n\n# Generate startup script (run as root or with sudo)\npm2 startup\n# PM2 will output a command - copy and run that command'))

story.append(heading2('6.8 Step 8 - Configure Nginx Reverse Proxy'))
story.append(body('CyberPanel uses OpenLiteSpeed by default, but you can configure Nginx as a reverse proxy to forward web traffic to your Next.js application running on port 3000. If you prefer using OpenLiteSpeed directly, refer to the CyberPanel documentation for creating a proxy context. This guide covers the Nginx approach as it provides more flexibility and is easier to configure for custom applications.'))
story.append(code('# Install Nginx (if not already installed)\nsudo apt update\nsudo apt install nginx -y\n\n# Create Nginx configuration\ncat &lt;&lt; \'EOF\' | sudo tee /etc/nginx/sites-available/eventra\nserver {\n&nbsp;&nbsp;&nbsp;&nbsp;listen 80;\n&nbsp;&nbsp;&nbsp;&nbsp;server_name yourdomain.com www.yourdomain.com;\n\n&nbsp;&nbsp;&nbsp;&nbsp;location / {\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_pass http://127.0.0.1:3000;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_http_version 1.1;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Upgrade $http_upgrade;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Connection \'upgrade\';\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Host $host;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header X-Real-IP $remote_addr;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header X-Forwarded-Proto $scheme;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_cache_bypass $http_upgrade;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proxy_read_timeout 86400;\n&nbsp;&nbsp;&nbsp;&nbsp;}\n\n&nbsp;&nbsp;&nbsp;&nbsp;# Static files served directly by Nginx for better performance\n&nbsp;&nbsp;&nbsp;&nbsp;location /_next/static/ {\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alias /home/eventra/.next/static/;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expires 365d;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;access_log off;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;add_header Cache-Control "public, immutable";\n&nbsp;&nbsp;&nbsp;&nbsp;}\n\n&nbsp;&nbsp;&nbsp;&nbsp;# Public assets served directly by Nginx\n&nbsp;&nbsp;&nbsp;&nbsp;location /images/ {\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alias /home/eventra/public/images/;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expires 30d;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;access_log off;\n&nbsp;&nbsp;&nbsp;&nbsp;}\n\n&nbsp;&nbsp;&nbsp;&nbsp;location /uploads/ {\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alias /home/eventra/public/uploads/;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expires 30d;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;access_log off;\n&nbsp;&nbsp;&nbsp;&nbsp;}\n\n&nbsp;&nbsp;&nbsp;&nbsp;# Client upload size limit\n&nbsp;&nbsp;&nbsp;&nbsp;client_max_body_size 10M;\n}\nEOF\n\n# Enable the site\nsudo ln -s /etc/nginx/sites-available/eventra /etc/nginx/sites-enabled/\n\n# Test configuration\nsudo nginx -t\n\n# Reload Nginx\nsudo systemctl reload nginx'))
story.append(note('Replace "yourdomain.com" and "www.yourdomain.com" with your actual domain name. If you do not have a domain yet, you can use the server IP address temporarily. Make sure your domain DNS A record points to the Azure VM IP address.'))

story.append(heading2('6.9 Step 9 - SSL Certificate with Let us Encrypt'))
story.append(body('Secure your website with HTTPS using a free SSL certificate from Let us Encrypt. Certbot automates the certificate issuance and renewal process. After installation, Certbot will automatically redirect all HTTP traffic to HTTPS, ensuring all communication between visitors and your website is encrypted.'))
story.append(code('# Install Certbot\nsudo apt install certbot python3-certbot-nginx -y\n\n# Obtain and install SSL certificate\nsudo certbot --nginx -d yourdomain.com -d www.yourdomain.com\n\n# Certbot will automatically configure Nginx for HTTPS\n# and set up auto-renewal via a cron job\n\n# Verify auto-renewal is configured\nsudo certbot renew --dry-run'))

story.append(heading2('6.10 Step 10 - Open Azure Firewall Ports'))
story.append(body('In the Azure Portal, ensure the following inbound ports are open in your VM Network Security Group (NSG). This is critical because even with correct Nginx configuration, the Azure firewall will block traffic if the required ports are not explicitly allowed.'))
story.append(make_table(
    ['Port', 'Protocol', 'Purpose', 'Source'],
    [
        ['80', 'TCP', 'HTTP traffic (redirects to HTTPS)', 'Internet'],
        ['443', 'TCP', 'HTTPS traffic', 'Internet'],
        ['22', 'TCP', 'SSH access for administration', 'Your IP only'],
        ['8090', 'TCP', 'CyberPanel dashboard (optional)', 'Your IP only'],
    ],
    col_ratios=[0.10, 0.12, 0.48, 0.30]
))
story.append(Spacer(1, 8))
story.append(note('For security, restrict SSH (port 22) and CyberPanel (port 8090) access to your own IP address only. Never leave these ports open to all Internet traffic (0.0.0.0/0) as this exposes your server to brute force attacks and unauthorized access attempts.'))

# ═══════════════ SECTION 7: ENVIRONMENT VARIABLES ═══════════════
story.append(heading1('7. Environment Variables'))
story.append(body('Environment variables are used to configure the application for different environments (development, production) without modifying the source code. All environment variables are stored in the .env file at the project root. This file should never be committed to version control as it contains sensitive configuration data.'))

story.append(make_table(
    ['Variable', 'Description', 'Example (Local)', 'Example (Production)'],
    [
        ['DATABASE_URL', 'SQLite connection string', 'file:/Users/you/eventra/db/custom.db', 'file:/home/eventra/db/custom.db'],
        ['PORT', 'Server port (standalone only)', '3000', '3000'],
        ['NODE_ENV', 'Environment mode', 'development', 'production'],
    ],
    col_ratios=[0.17, 0.22, 0.30, 0.31]
))
story.append(Spacer(1, 8))
story.append(note('The DATABASE_URL path must be an absolute path to the SQLite database file. On macOS, use /Users/username/... format. On Linux, use /home/username/... format. Relative paths are not supported by Prisma for SQLite connections.'))

# ═══════════════ SECTION 8: TROUBLESHOOTING ═══════════════
story.append(heading1('8. Troubleshooting'))
story.append(body('This section covers common issues you may encounter during installation, development, or deployment, along with their solutions. Most issues can be resolved by following the steps outlined below. If you encounter an issue not covered here, check the terminal/console output for error messages as they often contain specific guidance about the root cause.'))

story.append(heading2('8.1 npm install Fails'))
story.append(body('If npm install fails with errors, it is usually due to network issues, cached corrupted packages, or Node.js version incompatibility. Try the following solutions in order, starting with the least invasive approach.'))
story.append(code('# Clear npm cache\nnpm cache clean --force\n\n# Delete node_modules and reinstall\nrm -rf node_modules package-lock.json\nnpm install\n\n# If using Bun instead:\nrm -rf node_modules bun.lockb\nbun install'))

story.append(heading2('8.2 Prisma Client Not Found'))
story.append(body('If you see errors like "Cannot find module @prisma/client" or "PrismaClient is not a constructor", the Prisma client has not been generated or the database schema has not been pushed. This typically happens after a fresh clone or after modifying the Prisma schema.'))
story.append(code('# Regenerate Prisma client\nnpx prisma generate\n\n# Push schema to database\nnpx prisma db push'))

story.append(heading2('8.3 Blank Page / Only Logo Visible'))
story.append(body('If the website shows only a logo or blank page, the database has likely not been seeded with content. The page components fetch data from the API, and without seeded data, they display loading skeletons or fallback content. Ensure the dev server is running and seed the database.'))
story.append(code('# Make sure dev server is running\nnpm run dev\n\n# Seed the database\ncurl -X POST http://localhost:3000/api/seed'))

story.append(heading2('8.4 Port 3000 Already in Use'))
story.append(body('If you see an error like "Port 3000 is already in use", another process is occupying that port. You can either kill the existing process or start the dev server on a different port.'))
story.append(code('# Find and kill the process on port 3000\nlsof -i :3000\nkill -9 &lt;PID&gt;\n\n# Or use a different port\nnpm run dev -- -p 3001'))

story.append(heading2('8.5 Images Not Displaying'))
story.append(body('If images are not loading on the website, verify that the public/ directory contains the expected image files (hero1.png, hero2.png, hero3.png, about1.png, about2.png, about3.png, wedding.png, corporate.png, party.png, portfolio1-6.png, logo-eventra.png). These images should have been included with the project download. If any are missing, the corresponding sections will show broken image icons.'))

story.append(heading2('8.6 Build Fails on Server'))
story.append(body('If the production build fails on the Azure server, common causes include insufficient memory (the build process can use 500MB+ of RAM), missing dependencies, or incorrect Node.js version. Try increasing swap space, verifying Node.js version, and ensuring all dependencies are installed.'))
story.append(code('# Check available memory\nfree -h\n\n# Add swap space if RAM is limited (1GB swap)\nsudo fallocate -l 1G /swapfile\nsudo chmod 600 /swapfile\nsudo mkswap /swapfile\nsudo swapon /swapfile\n\n# Verify Node.js version\nnode --version&nbsp;&nbsp;# Should be 18+ or 20+\n\n# Reinstall dependencies and rebuild\nrm -rf node_modules\nnpm install\nnpm run build'))

story.append(heading2('8.7 PM2 Application Keeps Restarting'))
story.append(body('If PM2 shows the application in "errored" or "stopped" state, check the error logs for details. Common causes include incorrect DATABASE_URL path, missing database file, or the standalone server.js not being found at the expected path.'))
story.append(code('# Check PM2 logs\npm2 logs eventra --lines 50\n\n# Verify database exists\nls -la /home/eventra/db/custom.db\n\n# Verify standalone build exists\nls -la /home/eventra/.next/standalone/server.js\n\n# Restart with fresh state\npm2 delete eventra\npm2 start ecosystem.config.js'))

# ═══════════════ SECTION 9: SECURITY CHECKLIST ═══════════════
story.append(heading1('9. Security Checklist'))
story.append(body('Before making your Eventra website publicly accessible on the Internet, it is essential to implement these security measures. Failing to address these items could expose your server and user data to potential threats, unauthorized access, or data loss. Security is not a one-time task but an ongoing process of monitoring, updating, and hardening your deployment.'))

story.append(heading2('9.1 Critical Security Items'))
story.append(bullet('<b>Change admin credentials</b> - Modify the hardcoded email/password in src/app/api/admin/login/route.ts. Use a strong, unique password and consider implementing environment variable-based credentials instead of hardcoding them in the source code.'))
story.append(bullet('<b>Enable HTTPS</b> - Install an SSL certificate using Let us Encrypt (Certbot) as described in Section 6.9. Never serve a production website over plain HTTP, as it exposes user data including passwords and form submissions to interception.'))
story.append(bullet('<b>Restrict SSH access</b> - Configure the Azure NSG to allow SSH connections only from your IP address. Disable password-based SSH authentication and use SSH keys instead for significantly stronger security.'))
story.append(bullet('<b>Set NODE_ENV=production</b> - This disables Next.js development features, error stack traces in responses, and other debug information that should not be visible to end users in a production environment.'))
story.append(bullet('<b>Protect the .env file</b> - Ensure the .env file is included in .gitignore and is never committed to version control. This file contains the database path and potentially other sensitive configuration.'))
story.append(bullet('<b>Secure the /api/seed endpoint</b> - In production, consider removing or protecting the seed endpoint to prevent unauthorized database manipulation. Anyone who can access this endpoint could modify your website content.'))
story.append(bullet('<b>Set up database backups</b> - SQLite stores everything in a single file (custom.db). Set up automated daily backups using cron and rsync or a cloud backup service. A simple backup script can copy the database file to a backup directory with a date-stamped filename.'))

story.append(heading2('9.2 Backup Script Example'))
story.append(code('#!/bin/bash\n# Daily backup script for Eventra database\n# Save as /home/eventra/backup.sh\n\nDATE=$(date +%Y-%m-%d)\nBACKUP_DIR="/home/eventra/backups"\nmkdir -p $BACKUP_DIR\n\n# Copy and compress the database\ncp /home/eventra/db/custom.db $BACKUP_DIR/custom_$DATE.db\ngzip $BACKUP_DIR/custom_$DATE.db\n\n# Keep only last 30 days of backups\nfind $BACKUP_DIR -name "custom_*.db.gz" -mtime +30 -delete\n\necho "Backup completed: custom_$DATE.db.gz"'))
story.append(body('Add this script to a daily cron job to automate the backup process. Run "crontab -e" and add the following line to execute the backup every day at 2 AM server time:'))
story.append(code('0 2 * * * /home/eventra/backup.sh >> /home/eventra/logs/backup.log 2>&1'))

story.append(heading2('9.3 Update Deployment Workflow'))
story.append(body('When you need to update the production website with new code changes, follow this deployment workflow to minimize downtime and ensure a smooth update process. The key principle is to build the new version before stopping the old one, so the switchover happens in seconds rather than minutes.'))
story.append(code('# SSH into the server\nssh azureuser@YOUR_VM_IP\n\n# Navigate to the project\ncd /home/eventra\n\n# Pull latest changes\ngit pull origin main\n\n# Install any new dependencies\nnpm install\n\n# Rebuild for production\nnpm run build\n\n# Restart PM2 (zero-downtime reload)\npm2 reload eventra\n\n# Verify the application is running\npm2 status\npm2 logs eventra --lines 10'))

# ═══════════════ BUILD ═══════════════
doc.build(story)
print(f"PDF generated: {output}")
print(f"Size: {os.path.getsize(output) / 1024:.1f} KB")
