#!/usr/bin/env python3
import os
import re

header_script = '''<script src="https://cdn.tailwindcss.com"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><script>document.addEventListener("DOMContentLoaded",function(){if(!document.getElementById("bharatradar-header")){var e=document.createElement("header");e.id="bharatradar-header",e.className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-3 sm:px-6 z-50 shadow-lg",e.innerHTML='<div class="flex items-center gap-3"><div class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></div><a href="https://bharatradar.com" class="text-base sm:text-xl font-black tracking-widest uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">BharatRadar</a></div><ul class="flex items-center gap-4 sm:gap-6"><li><a href="https://map.bharatradar.com" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-solid fa-globe"></i> <span class="hidden sm:inline">Map</span></a></li><li><a href="https://api.bharatradar.com" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-solid fa-code"></i> <span class="hidden sm:inline">API</span></a></li><li><a href="https://mlat.bharatradar.com" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-solid fa-location-dot"></i> <span class="hidden sm:inline">MLAT</span></a></li><li><a href="https://cortex.bharatradar.com" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-solid fa-user-astronaut"></i> <span class="hidden sm:inline">Portal</span></a></li><li><a href="/docs/" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-solid fa-book"></i> <span class="hidden sm:inline">Docs</span></a></li><li><a href="https://github.com/bharatradar" class="text-gray-400 hover:text-white transition text-sm sm:text-base"><i class="fa-brands fa-github"></i> <span class="hidden sm:inline">GitHub</span></a></li></ul>';document.body.insertBefore(e,document.body.firstChild);document.body.style.paddingTop="4rem"}});</script>'''

pattern = r"(<script>\(\(\)=>\{document\.documentElement\.setAttribute\(\"data-dark-mode\"\,\"\"\),localStorage\.setItem\(\"theme\"\,\"dark\"\)\}\(\)</script>)"

for root, dirs, files in os.walk('.'):
    for fname in files:
        if fname == 'index.html':
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Check if already injected
            if 'bharatradar-header' in content:
                print(f"Skipping {fpath} - already has header")
                continue
            
            # Replace the dark mode script with dark mode script + header
            new_content = re.sub(pattern, r'\1' + header_script, content)
            
            with open(fpath, 'w', encoding='utf-8', errors='ignore') as f:
                f.write(new_content)
            print(f"Updated {fpath}")
