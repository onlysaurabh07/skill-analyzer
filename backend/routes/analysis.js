const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/analysis/analyze
router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { jobTarget, jobDescription } = req.body;
    if (!req.file && !req.body.resumeText)
      return res.status(400).json({ message: 'Resume file or text is required' });
    if (!jobTarget)
      return res.status(400).json({ message: 'Job target is required' });

    // Extract text from PDF
    let resumeText = req.body.resumeText || '';
    if (req.file) {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();
      resumeText = parsed.text;
      await parser.destroy();
    }

    const jd = jobDescription || `${jobTarget} job requirements`;

    // OpenAI prompt
    const prompt = `You are an expert career coach and skill gap analyst. 
Analyze the following resume and job description carefully.

RESUME TEXT:
"""
${resumeText.slice(0, 3000)}
"""

JOB TITLE: ${jobTarget}
JOB DESCRIPTION:
"""
${jd.slice(0, 2000)}
"""

Return ONLY a valid JSON object with the following structure (no markdown, no explanation):
{
  "resumeSkills": ["list of skills found in the resume"],
  "matchingSkills": ["skills from resume that match job requirements"],
  "missingSkills": ["important skills required for the job that are missing from the resume"],
  "matchScore": <number between 0-100 representing the overall match percentage>,
  "roadmap": [
    {
      "week": 1,
      "focus": "Topic Focus Area",
      "topics": ["Topic 1", "Topic 2"],
      "resources": [
        { "title": "Resource name", "url": "https://...", "type": "course|doc|video|article" }
      ]
    }
  ]
}
Generate a 6-week roadmap covering the most critical missing skills. Provide 2-3 real, accurate resource URLs per week.`;

    let analysis;
    let isSampleData = false;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const raw = completion.choices[0].message.content.trim();
      analysis = JSON.parse(raw);
    } catch (err) {
      console.warn('OpenAI error (possibly quota/key), falling back to dynamic mock data:', err.message);
      isSampleData = true;
      
      // DYNAMIC MOCK DATA FALLBACK
      const target = jobTarget.toLowerCase();
      
      let mockSkills = ["Project Management", "Team Collaboration", "Problem Solving"];
      let mockMissing = ["Technical Documentation", "Product Strategy"];
      
      if (target.includes('devops') || target.includes('cloud')) {
        mockSkills = ["Docker", "Linux", "Git", "JavaScript"];
        mockMissing = ["Kubernetes", "Terraform", "AWS", "Jenkins", "Prometheus"];
      } else if (target.includes('full stack') || target.includes('frontend') || target.includes('backend') || target.includes('web')) {
        mockSkills = ["React", "Node.js", "JavaScript", "HTML", "CSS"];
        mockMissing = ["TypeScript", "Next.js", "Docker", "Redux", "GraphQL"];
      } else if (target.includes('ml') || target.includes('machine learning') || target.includes('data') || target.includes('ai')) {
        mockSkills = ["Python", "SQL", "Statistics", "Data Visualization"];
        mockMissing = ["PyTorch", "TensorFlow", "Scikit-Learn", "Feature Engineering", "MLOps"];
      } else if (target.includes('ui') || target.includes('ux') || target.includes('design')) {
        mockSkills = ["Figma", "Visual Design", "HTML", "CSS"];
        mockMissing = ["Prototyping", "User Research", "Wireframing", "Adobe XD", "Accessibility"];
      }

      analysis = {
        resumeSkills: mockSkills,
        matchingSkills: mockSkills.slice(0, 3),
        missingSkills: mockMissing,
        matchScore: 65 + Math.floor(Math.random() * 20),
        roadmap: mockMissing.map((skill, index) => ({
          week: index + 1,
          focus: `Mastering ${skill}`,
          topics: [`${skill} Basics`, `Advanced ${skill} Patterns`, `Real-world ${skill} Project`],
          resources: [{ title: `${skill} Official Docs`, url: `https://google.com/search?q=${encodeURIComponent(skill + ' documentation')}`, type: "doc" }]
        }))
      };
    }

    // Save to DB
    const saved = await Analysis.create({
      userId: req.userId,
      jobTarget,
      jobDescription: jd,
      matchScore: analysis.matchScore || 0,
      matchingSkills: analysis.matchingSkills || [],
      missingSkills: analysis.missingSkills || [],
      resumeSkills: analysis.resumeSkills || [],
      roadmap: analysis.roadmap || [],
      isSampleData: isSampleData,
    });

    res.json(saved);
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analysis/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .select('jobTarget matchScore createdAt missingSkills matchingSkills')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analysis/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) return res.status(404).json({ message: 'Not found' });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
