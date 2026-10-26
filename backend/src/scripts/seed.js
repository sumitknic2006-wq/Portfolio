import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { devFixtures } from '../services/portfolio.service.js';
import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Achievement } from '../models/Achievement.js';
import { Education } from '../models/Education.js';
import { Experience } from '../models/Experience.js';
import { CodingProfile } from '../models/CodingProfile.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { curatedDsaProblems } from '../fixtures/dsaFixtures.js';

/**
 * Idempotent Portfolio Database Seed Script
 * 
 * Usage:
 *   node src/scripts/seed.js            # Standard idempotent upsert seed
 *   node src/scripts/seed.js --dry-run  # Dry-run validation check without writes
 */

const isDryRun = process.argv.includes('--dry-run');

export async function seedDatabase(customUri = null) {
  console.log(`\n🌱 [Seed] Initiating portfolio database seeding (dryRun: ${isDryRun})...`);

  // Connect to database if not already connected
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB(customUri);
    } catch (err) {
      if (isDryRun) {
        console.warn(`⚠️ [Seed Dry-Run] Live database offline (${err.message}). Proceeding with offline schema validation...`);
      } else {
        throw new Error(`Database connection failed: ${err.message}. Seeding aborted.`);
      }
    }
  }

  const results = {
    profile: null,
    projects: 0,
    skills: 0,
    achievements: 0,
    education: 0,
    experience: 0,
    codingProfiles: 0,
    dsaProblems: 0,
  };

  try {
    // 1. Seed / Upsert Profile (Single Default Profile Strategy)
    const profileDoc = new Profile({
      ...devFixtures.profile,
      isDefault: true,
      isPublished: true,
    });
    await profileDoc.validate();

    if (!isDryRun && mongoose.connection.readyState === 1) {
      await Profile.findOneAndUpdate(
        { isDefault: true },
        {
          $set: {
            ...devFixtures.profile,
            isDefault: true,
            isPublished: true,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
    }
    results.profile = devFixtures.profile.name;
    console.log(`  ✓ Profile: ${devFixtures.profile.name} (${devFixtures.profile.headline})`);

    // 2. Seed / Upsert Projects (Idempotent by unique slug)
    for (const project of devFixtures.projects) {
      const projDoc = new Project({ ...project, isPublished: true });
      await projDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await Project.findOneAndUpdate(
          { slug: project.slug },
          { $set: { ...project, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.projects++;
      console.log(`  ✓ Project: ${project.title} (${project.slug})`);
    }

    // 3. Seed / Upsert Skills (Idempotent by categoryKey)
    for (const category of devFixtures.skills) {
      const skillDoc = new Skill({ ...category, isPublished: true });
      await skillDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await Skill.findOneAndUpdate(
          { categoryKey: category.categoryKey },
          { $set: { ...category, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.skills++;
      console.log(`  ✓ Skill Category: ${category.category} (${category.skills.length} skills)`);
    }

    // 4. Seed / Upsert Achievements (Idempotent by id)
    for (const achievement of devFixtures.achievements) {
      const achDoc = new Achievement({ ...achievement, isPublished: true });
      await achDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await Achievement.findOneAndUpdate(
          { id: achievement.id },
          { $set: { ...achievement, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.achievements++;
      console.log(`  ✓ Achievement: ${achievement.title} (${achievement.id})`);
    }

    // 5. Seed / Upsert Education (Idempotent by id)
    for (const edu of devFixtures.education) {
      const eduDoc = new Education({ ...edu, isPublished: true });
      await eduDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await Education.findOneAndUpdate(
          { id: edu.id },
          { $set: { ...edu, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.education++;
      console.log(`  ✓ Education: ${edu.degree} @ ${edu.university}`);
    }

    // 6. Seed / Upsert Experience (Idempotent by id)
    for (const exp of devFixtures.experience) {
      const expDoc = new Experience({ ...exp, isPublished: true });
      await expDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await Experience.findOneAndUpdate(
          { id: exp.id },
          { $set: { ...exp, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.experience++;
      console.log(`  ✓ Experience: ${exp.role} (${exp.organization})`);
    }

    // 7. Seed / Upsert Coding Profiles (Idempotent by platform)
    for (const cp of devFixtures.codingProfiles) {
      const cpDoc = new CodingProfile({ ...cp, isPublished: true });
      await cpDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await CodingProfile.findOneAndUpdate(
          { platform: cp.platform },
          { $set: { ...cp, isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.codingProfiles++;
      console.log(`  ✓ Coding Profile: ${cp.platform} (${cp.username})`);
    }

    // 8. Seed / Upsert Curated DSA Problems (Idempotent by slug)
    for (const prob of curatedDsaProblems) {
      const probDoc = new DsaProblem({ ...prob, provenance: 'curated_example', isPublished: true });
      await probDoc.validate();

      if (!isDryRun && mongoose.connection.readyState === 1) {
        await DsaProblem.findOneAndUpdate(
          { slug: prob.slug },
          { $set: { ...prob, provenance: 'curated_example', isPublished: true } },
          { upsert: true, new: true, runValidators: true }
        );
      }
      results.dsaProblems++;
      console.log(`  ✓ DSA Problem (Curated Example): [${prob.platform.toUpperCase()}] ${prob.title} (${prob.problemId})`);
    }

    console.log('\n✨ [Seed] Completed successfully! Seeded counts:');
    console.table(results);
    return results;
  } catch (error) {
    console.error(`❌ [Seed] Execution error: ${error.message}`);
    throw error;
  }
}

// Execute standalone when invoked directly from command line
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await disconnectDB();
      process.exit(1);
    });
}

export default seedDatabase;
