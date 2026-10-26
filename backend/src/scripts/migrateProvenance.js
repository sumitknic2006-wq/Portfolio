import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { curatedDsaProblems } from '../fixtures/dsaFixtures.js';

export async function migrateLegacyProvenance() {
  const curatedSlugs = new Set(curatedDsaProblems.map((p) => p.slug.toLowerCase()));

  const legacyDocs = await DsaProblem.find({
    $or: [
      { provenance: { $exists: false } },
      { provenance: null },
      { provenance: '' },
    ],
  });

  if (legacyDocs.length === 0) {
    return { migratedCount: 0 };
  }

  let migratedCount = 0;
  for (const doc of legacyDocs) {
    if (curatedSlugs.has(doc.slug.toLowerCase())) {
      doc.provenance = 'curated_example';
    } else if (doc.isCustom || (doc.sourceCode && doc.sourceCode.trim().length > 0)) {
      doc.provenance = 'manual_import';
    } else {
      doc.provenance = 'manual_import';
    }
    await doc.save();
    migratedCount++;
    console.log(`[Migration] Migrated legacy record "${doc.slug}" to provenance "${doc.provenance}"`);
  }

  return { migratedCount };
}

// If run directly via CLI
if (process.argv[1]?.endsWith('migrateProvenance.js')) {
  (async () => {
    try {
      await connectDB();
      const res = await migrateLegacyProvenance();
      console.log('Migration finished:', res);
      const counts = await DsaProblem.aggregate([
        { $group: { _id: '$provenance', count: { $sum: 1 } } },
      ]);
      console.log('Current provenance counts:', counts);
    } catch (err) {
      console.error('Migration failed:', err);
    } finally {
      await disconnectDB();
      process.exit(0);
    }
  })();
}
