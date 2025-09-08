-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS brand_id_seq;
CREATE SEQUENCE IF NOT EXISTS personality_id_seq;
CREATE SEQUENCE IF NOT EXISTS adjectives_id_seq;
CREATE SEQUENCE IF NOT EXISTS rules_id_seq;

-- Set the sequences to start from the next available ID
SELECT setval('brand_id_seq', COALESCE((SELECT MAX(id) FROM brand), 0) + 1, false);
SELECT setval('personality_id_seq', COALESCE((SELECT MAX(id) FROM personality), 0) + 1, false);
SELECT setval('adjectives_id_seq', COALESCE((SELECT MAX(id) FROM adjectives), 0) + 1, false);
SELECT setval('rules_id_seq', COALESCE((SELECT MAX(id) FROM rules), 0) + 1, false);

-- Set default values to use sequences
ALTER TABLE "brand" ALTER COLUMN "id" SET DEFAULT nextval('brand_id_seq');
ALTER TABLE "personality" ALTER COLUMN "id" SET DEFAULT nextval('personality_id_seq');
ALTER TABLE "adjectives" ALTER COLUMN "id" SET DEFAULT nextval('adjectives_id_seq');
ALTER TABLE "rules" ALTER COLUMN "id" SET DEFAULT nextval('rules_id_seq');

-- Associate sequences with columns (makes them SERIAL-like)
ALTER SEQUENCE brand_id_seq OWNED BY brand.id;
ALTER SEQUENCE personality_id_seq OWNED BY personality.id;
ALTER SEQUENCE adjectives_id_seq OWNED BY adjectives.id;
ALTER SEQUENCE rules_id_seq OWNED BY rules.id;