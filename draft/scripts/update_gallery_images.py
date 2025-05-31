#!/usr/bin/env python3
"""
Script to automatically scan the Timeline Related Photos directory
and update the gallery-images.json file with all image files found.
"""

import os
import json
import glob
from pathlib import Path

# Set up paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
IMAGES_DIR = os.path.join(ROOT_DIR, 'src', 'assets', 'images', 'Timeline Related Photos')
JSON_PATH = os.path.join(ROOT_DIR, 'src', 'data', 'gallery-images.json')

# Files to exclude
EXCLUDE_FILES = ['samaj logo.png', 'samaj.jpg', 'school.jpg']

def main():
    """Main function to update gallery images JSON file."""
    print(f"Scanning directory: {IMAGES_DIR}")
    
    if not os.path.exists(IMAGES_DIR):
        print(f"Error: Directory not found: {IMAGES_DIR}")
        return
    
    # List to store image paths
    image_paths = []
    
    # Find all image files recursively
    for ext in ('*.jpg', '*.jpeg', '*.png', '*.gif', '*.JPG', '*.JPEG', '*.PNG', '*.GIF'):
        for image_path in glob.glob(os.path.join(IMAGES_DIR, '**', ext), recursive=True):
            # Convert to relative path
            rel_path = os.path.relpath(image_path, IMAGES_DIR)
            # Normalize path (use forward slashes)
            rel_path = rel_path.replace('\\', '/')
            
            # Check if file is in the exclude list
            filename = os.path.basename(rel_path)
            if filename not in EXCLUDE_FILES:
                image_paths.append(rel_path)
    
    print(f"Found {len(image_paths)} images (before deduplication)")
    
    # Remove duplicates while preserving order
    unique_paths = []
    seen = set()
    for path in image_paths:
        if path not in seen:
            seen.add(path)
            unique_paths.append(path)
    
    print(f"Found {len(unique_paths)} unique images (after deduplication)")
    
    # Sort images by path
    unique_paths.sort()
    
    # Create data structure
    data = {
        'images': unique_paths
    }
    
    # Ensure data directory exists
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    
    # Write to JSON file
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated gallery images JSON file: {JSON_PATH}")
    print(f"Total unique images: {len(unique_paths)}")

if __name__ == "__main__":
    main() 