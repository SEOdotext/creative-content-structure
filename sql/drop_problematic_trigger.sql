-- SQL script to identify and drop the problematic trigger
-- Run this in the Supabase SQL editor

-- First, let's identify all triggers on the website_content table
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'website_content';

-- Now, let's specifically look for BEFORE triggers that might be affecting is_primary
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'website_content'
AND action_timing = 'BEFORE'
AND action_statement LIKE '%is_primary%';

-- Let's drop all BEFORE triggers on the website_content table that affect is_primary
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_table = 'website_content'
        AND action_timing = 'BEFORE'
        AND action_statement LIKE '%is_primary%'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_rec.trigger_name || ' ON website_content';
        RAISE NOTICE 'Dropped trigger: %', trigger_rec.trigger_name;
    END LOOP;
END $$;

-- Let's also check for any functions that might be used by these triggers
SELECT proname, prosrc
FROM pg_proc
WHERE prosrc LIKE '%is_primary%'
AND proname LIKE '%website_content%';

-- Now, let's test if we can update multiple rows with is_primary = TRUE
UPDATE website_content
SET is_primary = TRUE
WHERE id IN (
    SELECT id
    FROM website_content
    ORDER BY created_at DESC
    LIMIT 3
)
RETURNING id, title, is_primary;

-- Check if the update worked
SELECT id, website_id, title, url, is_primary
FROM website_content
WHERE is_primary = TRUE
ORDER BY website_id, title; 