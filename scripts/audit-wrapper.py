#!/usr/bin/env python3
"""
SEO Audit Wrapper - Calculates composite SEO scores for clients
Calls the existing seo_audit.py logic and generates a score
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import sys
from datetime import datetime
from urllib.parse import urljoin, quote

def calculate_seo_score(url):
    """
    Analyze a single URL and return SEO metrics
    Returns dict with score (0-100) and breakdown
    """
    try:
        # Add timeout and headers to avoid blocks
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, timeout=5, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        score = 100
        issues = []
        
        # 1. Title tag (10 points)
        title = soup.find('title')
        title_text = title.get_text(strip=True) if title else ''
        title_length = len(title_text)
        
        if not title_text:
            score -= 10
            issues.append("Missing title tag")
        elif title_length < 30 or title_length > 60:
            score -= 5
            issues.append(f"Title length {title_length} (ideal 30-60)")
        
        # 2. Meta description (10 points)
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        meta_desc_text = meta_desc.get('content', '') if meta_desc else ''
        meta_desc_length = len(meta_desc_text)
        
        if not meta_desc_text:
            score -= 10
            issues.append("Missing meta description")
        elif meta_desc_length < 120 or meta_desc_length > 160:
            score -= 5
            issues.append(f"Meta description length {meta_desc_length} (ideal 120-160)")
        
        # 3. H1 tags (15 points)
        h1_tags = soup.find_all('h1')
        h1_count = len(h1_tags)
        
        if h1_count == 0:
            score -= 15
            issues.append("Missing H1 tag")
        elif h1_count > 1:
            score -= 5
            issues.append(f"Multiple H1 tags ({h1_count})")
        
        # 4. Heading hierarchy (10 points)
        h2_tags = soup.find_all('h2')
        h3_tags = soup.find_all('h3')
        
        if len(h2_tags) == 0 and len(h3_tags) == 0:
            score -= 10
            issues.append("Missing H2/H3 heading structure")
        
        # 5. Images with alt text (15 points)
        images = soup.find_all('img')
        imgs_no_alt = len([img for img in images if not img.get('alt')])
        total_images = len(images)
        
        if total_images > 0:
            alt_percentage = ((total_images - imgs_no_alt) / total_images) * 100
            if alt_percentage < 80:
                deduction = int((100 - alt_percentage) / 10)
                score -= min(deduction, 15)
                issues.append(f"{imgs_no_alt}/{total_images} images missing alt text")
        
        # 6. Internal linking (10 points)
        internal_links = soup.find_all('a', href=re.compile(r'^(/|https?://)'))
        if len(internal_links) < 3:
            score -= 10
            issues.append("Poor internal linking structure")
        
        # 7. Mobile viewport meta tag (10 points)
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport:
            score -= 10
            issues.append("Missing viewport meta tag")
        
        # 8. Canonical tag (5 points)
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if not canonical:
            score -= 5
            issues.append("Missing canonical tag")
        
        # 9. Page speed estimate (15 points - basic check)
        total_size = len(response.content)
        if total_size > 2000000:  # > 2MB
            score -= 15
            issues.append("Large page size (>2MB)")
        elif total_size > 1000000:  # > 1MB
            score -= 8
            issues.append("Large page size (>1MB)")
        
        # Ensure score stays between 0-100
        score = max(0, min(100, score))
        
        return {
            'url': url,
            'score': score,
            'title': title_text[:60],
            'title_length': title_length,
            'meta_description': meta_desc_text[:160],
            'meta_description_length': meta_desc_length,
            'h1_count': h1_count,
            'h2_h3_count': len(h2_tags) + len(h3_tags),
            'images_total': total_images,
            'images_no_alt': imgs_no_alt,
            'internal_links': len(internal_links),
            'has_viewport': bool(viewport),
            'has_canonical': bool(canonical),
            'page_size_kb': round(total_size / 1024, 1),
            'issues': issues,
            'timestamp': datetime.now().isoformat()
        }
    
    except Exception as e:
        return {
            'url': url,
            'score': 0,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

def audit_client(client_name, client_url, competitors=None):
    """
    Run full audit for a client including competitors
    """
    if competitors is None:
        competitors = []
    
    client_audit = calculate_seo_score(client_url)
    competitor_audits = [
        {'name': c['name'], 'url': c['url'], **calculate_seo_score(c['url'])}
        for c in competitors
    ]
    
    return {
        'client_name': client_name,
        'client': client_audit,
        'competitors': competitor_audits,
        'audit_date': datetime.now().isoformat()
    }

def get_pagespeed_score(url, api_key):
    """
    Fetch real PageSpeed scores from Google API
    """
    try:
        encoded_url = quote(url, safe='')
        
        # Mobile
        mobile_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={encoded_url}&key={api_key}&strategy=mobile"
        print(f"Fetching mobile: {mobile_url[:80]}...", file=sys.stderr)
        mobile_response = requests.get(mobile_url, timeout=30)
        mobile_data = mobile_response.json()
        mobile_score = mobile_data.get('lighthouseResult', {}).get('categories', {}).get('performance', {}).get('score', 0) * 100
        
        # Desktop
        desktop_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={encoded_url}&key={api_key}&strategy=desktop"
        print(f"Fetching desktop: {desktop_url[:80]}...", file=sys.stderr)
        desktop_response = requests.get(desktop_url, timeout=30)
        desktop_data = desktop_response.json()
        desktop_score = desktop_data.get('lighthouseResult', {}).get('categories', {}).get('performance', {}).get('score', 0) * 100
        
        return {
            'mobile': int(mobile_score),
            'desktop': int(desktop_score)
        }
    except Exception as e:
        print(f"PageSpeed API error: {str(e)}", file=sys.stderr)
        return None

if __name__ == '__main__':
    if len(sys.argv) > 1:
        url = sys.argv[1]
        api_key = sys.argv[2] if len(sys.argv) > 2 else None
        result = calculate_seo_score(url)
        
        # Don't fetch PageSpeed here - too slow for background audits
        # PageSpeed will be fetched on-demand via separate API endpoint
        
        print(json.dumps(result, indent=2))
    else:
        # Test run
        test_url = 'https://alexanders-roofing.vercel.app'
        result = calculate_seo_score(test_url)
        print(json.dumps(result, indent=2))
