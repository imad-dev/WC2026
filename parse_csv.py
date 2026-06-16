import csv

with open('www.wc2026.games_mega_export_20260611.csv', 'r') as f:
    reader = csv.reader(f)
    headers = next(reader)
    for row in reader:
        url = row[0]
        issues = []
        for i, val in enumerate(row[1:], start=1):
            if val != '0' and val != '':
                issues.append(f"{headers[i]} ({val})")
        if issues:
            print(f"{url}: {', '.join(issues)}")
