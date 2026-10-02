"""Check the current movement contract against OpenAPI and the Vite proxy.
Run from repository root: python3 docs/check-api-contract.py
This focused check is not a general TypeScript parser or a browser validator.
"""
import json
import re
from datetime import date
from pathlib import Path
from urllib.request import urlopen


def read_json(url):
    with urlopen(url, timeout=10) as response:
        assert response.status == 200
        return json.load(response)


source = Path('frontend/src/lib/financial-types.ts').read_text()
interface = re.search(r'export interface FinancialMovement\s*\{([^}]+)\}', source).group(1)
fields = dict(re.findall(r'(\w+)\s*:\s*(\w+)', interface))
schemas = read_json('http://127.0.0.1:8000/openapi.json')['components']['schemas']
properties = schemas['FinancialMovement']['properties']
assert set(fields) == set(properties) == set(schemas['FinancialMovement']['required'])
assert fields['create_date'] == 'string' and properties['create_date']['format'] == 'date'
assert fields['amount'] == 'number' and properties['amount']['type'] == 'number'
for field in ['operation_type', 'category', 'business_type']:
    match = re.search(r'export type '+fields[field]+r'\s*=([^\n]+)', source)
    values = set(re.findall(r"['\"]([^'\"]+)['\"]", match.group(1)))
    assert values == set(properties[field]['enum']), field
movements = read_json('http://127.0.0.1:5173/api/metrics')
assert isinstance(movements, list) and movements
for movement in movements:
    assert set(movement) == set(fields)
    date.fromisoformat(movement['create_date'])
    assert isinstance(movement['amount'], (int, float)) and not isinstance(movement['amount'], bool)
    for field in ['operation_type', 'category', 'business_type']:
        assert movement[field] in properties[field]['enum']
print('Contract OK:', ', '.join(fields))
print('Proxy OK:', len(movements), 'movements')
print('Actual period:', min(m['create_date'] for m in movements), '-', max(m['create_date'] for m in movements))
