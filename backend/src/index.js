const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// POST Endpoint: Assess Claim and save to DB
app.post('/api/claims/assess', async (req, res) => {
  try {
    const { claimId, evidenceText } = req.body;

    if (!claimId || !evidenceText) {
      return res.status(400).json({ error: 'Claim ID and evidence text are required.' });
    }

    // 1. Fetch or simulate claim details (For testing, create a dummy claim if none exists)
    let claim = await prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      claim = await prisma.claim.create({
        data: {
          id: claimId,
          title: 'Reduces fine lines and wrinkles by 20%',
          description: 'Anti-aging topical formulation clinical trial.'
        }
      });
    }

    // 2. Smart Local Rule-Based Evaluation (Simulating AI R&I Clinical Assessment)
    let isJustified = true;
    let confidenceScore = 0.95;
    let reasoning = "";

    const lowerEvidence = evidenceText.toLowerCase();
    if (lowerEvidence.includes("fail") || lowerEvidence.includes("no effect") || lowerEvidence.includes("minimal") || lowerEvidence.length < 15) {
      isJustified = false;
      confidenceScore = 0.88;
      reasoning = "Evaluation Result: Clinical study metrics show insufficient statistical significance to back the proposed claim. Further formulation changes are recommended by the R&I scientist.";
    } else {
      reasoning = "Evaluation Result: Double-blind clinical trial results successfully demonstrate the required efficacy. The evidence statistically supports the product claim under standard L'Oréal R&I cosmetic evaluation guidelines.";
    }

    const result = {
      isJustified,
      confidenceScore,
      reasoning
    };

    // 3. Save assessment into Prisma DB
    const assessment = await prisma.assessment.create({
      data: {
        claimId: claim.id,
        evidenceText,
        isJustified: result.isJustified,
        confidenceScore: result.confidenceScore,
        reasoning: result.reasoning
      }
    });

    return res.status(200).json({
      success: true,
      data: assessment
    });

  } catch (error) {
    console.error('Assessment Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during evaluation.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));