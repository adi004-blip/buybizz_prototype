-- Remove unique constraint on user_agents (userId, agentId)
-- This allows users to have multiple API keys for the same agent
-- (e.g., when purchasing quantity > 1 or buying the same agent multiple times)

-- Drop the unique constraint
ALTER TABLE "user_agents" DROP CONSTRAINT IF EXISTS "user_agents_user_id_agent_id_key";

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "user_agents_user_id_idx" ON "user_agents"("user_id");
CREATE INDEX IF NOT EXISTS "user_agents_user_id_agent_id_idx" ON "user_agents"("user_id", "agent_id");

-- Verify the constraint is removed (run this separately to check)
-- SELECT conname FROM pg_constraint WHERE conrelid = 'user_agents'::regclass AND conname LIKE '%user_id%agent_id%';
-- Should return 0 rows

-- Verify indexes are created (run this separately to check)
-- SELECT indexname FROM pg_indexes WHERE tablename = 'user_agents' AND indexname LIKE '%user_id%';
-- Should show: user_agents_user_id_idx and user_agents_user_id_agent_id_idx

