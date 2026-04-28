/**
 * Export OpenAPI spec to openapi.json
 * Run: npx ts-node scripts/export-openapi.ts
 */
import { writeFileSync } from 'fs'
import { join } from 'path'

import { swaggerSpec } from '../src/swagger'

const outputPath = join(__dirname, '..', 'openapi.json')
writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8')
console.log(`OpenAPI spec written to ${outputPath}`)
