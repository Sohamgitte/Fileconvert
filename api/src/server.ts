import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const maxMb = Number(process.env.MAX_UPLOAD_MB ?? 50);
const upload = multer({ limits: { fileSize: maxMb * 1024 * 1024 } });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const allowed: Record<string, string[]> = { pdf: ['docx','txt','jpg','png'], docx: ['pdf','txt','html'], xlsx: ['pdf','csv'], csv: ['xlsx','pdf'], pptx: ['pdf'], jpg: ['png','webp','pdf'], jpeg: ['png','webp','pdf'], png: ['jpg','webp','pdf'], webp: ['jpg','png','pdf'], txt: ['pdf','docx','html'], json: ['txt','csv','html'] };
app.use(cors({ origin: (process.env.CORS_ORIGINS ?? '*').split(',') }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true, service: 'fileconvert-api' }));
app.post('/v1/conversions/validate', (req, res) => { const input = String(req.body.inputExtension ?? '').toLowerCase().replace('.', ''); const output = String(req.body.outputExtension ?? '').toLowerCase().replace('.', ''); if (!allowed[input]?.includes(output)) return res.status(400).json({ error: 'Unsupported conversion pair' }); return res.json({ allowed: true }); });
app.post('/v1/uploads', upload.single('file'), async (req, res) => { if (!req.file) return res.status(400).json({ error: 'A file is required' }); const userId = String(req.headers['x-user-id'] ?? 'anonymous'); const path = `${userId}/${crypto.randomUUID()}-${req.file.originalname}`; const result = await supabase.storage.from('conversion-files').upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false }); if (result.error) return res.status(500).json({ error: 'Upload failed' }); return res.status(201).json({ path, fileName: req.file.originalname }); });
app.listen(Number(process.env.PORT ?? 4000), () => console.log('FileConvert API running'));
