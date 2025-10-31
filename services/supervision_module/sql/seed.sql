-- Seed the database with demo data (Zimbabwean banks + capital markets samples)
-- Run this connected to the 'amlguard' database.
-- Requires that migrations (migrations/001_init.sql) have already been applied.

BEGIN;

-- Keep track of three primary institutions to reference by id in later inserts
CREATE TEMP TABLE seed_primary_insts (id uuid, name text);

INSERT INTO seed_primary_insts (id, name)
SELECT id, name FROM (
  INSERT INTO institutions(name, license_number, category, status, risk_level, risk_score)
  VALUES 
    ('ABC Brokers', 'ZSE/BR/0001', 'Stockbroker', 'Active', 'Medium', 68),
    ('XYZ Capital', 'ZSE/IM/0002', 'Investment Manager', 'Active', 'High', 82),
    ('SafeCustody Ltd', 'ZSE/CU/0003', 'Custodian', 'Suspended', 'Low', 55)
  RETURNING id, name
) s;

-- Zimbabwean banks sample data
INSERT INTO institutions(name, license_number, category, status, risk_level, risk_score)
VALUES 
 ('CBZ Bank Limited','RBZ/BK/0001','Bank','Active','Medium',68),
 ('Stanbic Bank Zimbabwe Limited','RBZ/BK/0002','Bank','Active','Low',55),
 ('FBC Bank Limited','RBZ/BK/0003','Bank','Active','Medium',62),
 ('NMB Bank Limited','RBZ/BK/0004','Bank','Active','Medium',60),
 ('BancABC Zimbabwe','RBZ/BK/0005','Bank','Active','High',78),
 ('Steward Bank Limited','RBZ/BK/0006','Bank','Active','High',81),
 ('ZB Bank Limited','RBZ/BK/0007','Bank','Active','Medium',64),
 ('First Capital Bank Zimbabwe','RBZ/BK/0008','Bank','Active','Low',52),
 ('Ecobank Zimbabwe','RBZ/BK/0009','Bank','Active','Medium',59),
 ('Nedbank Zimbabwe','RBZ/BK/0010','Bank','Active','Low',50),
 ('People’s Own Savings Bank (POSB)','RBZ/BK/0011','Bank','Active','Medium',58);

-- Risk profiles for the three primary institutions
INSERT INTO risk_profiles(institution_id, overall_risk_level, overall_risk_score, assessed_at)
SELECT id, level, score, now()
FROM (
  VALUES 
    ((SELECT id FROM seed_primary_insts WHERE name = 'ABC Brokers'), 'Medium', 68),
    ((SELECT id FROM seed_primary_insts WHERE name = 'XYZ Capital'), 'High', 82),
    ((SELECT id FROM seed_primary_insts WHERE name = 'SafeCustody Ltd'), 'Low', 55)
) AS t(id, level, score);

-- Compliance status
INSERT INTO compliance_status(institution_id, status, compliant, non_compliant, partial)
SELECT id, status, c, nc, p
FROM (
  VALUES 
    ((SELECT id FROM seed_primary_insts WHERE name = 'ABC Brokers'), 'OK', 10, 2, 1),
    ((SELECT id FROM seed_primary_insts WHERE name = 'XYZ Capital'), 'ATTENTION', 7, 4, 2),
    ((SELECT id FROM seed_primary_insts WHERE name = 'SafeCustody Ltd'), 'SUSPENDED', 3, 8, 1)
) AS t(id, status, c, nc, p);

-- Surveillance logs
INSERT INTO surveillance_logs(institution_id, type, severity, description, occurred_at)
SELECT id, type, sev, descr, now() - offs
FROM (
  VALUES 
    ((SELECT id FROM seed_primary_insts WHERE name = 'ABC Brokers'), 'Monitoring', 'Medium', 'Unusual transaction pattern detected', INTERVAL '10 days'),
    ((SELECT id FROM seed_primary_insts WHERE name = 'XYZ Capital'), 'CDD', 'High', 'CDD gaps for high-risk clients', INTERVAL '5 days'),
    ((SELECT id FROM seed_primary_insts WHERE name = 'SafeCustody Ltd'), 'Reporting', 'Low', 'Late STR submission by 1 day', INTERVAL '2 days')
) AS t(id, type, sev, descr, offs);

-- Inspection findings
INSERT INTO inspection_findings(institution_id, category, severity, description, recommendation, due_date, status)
SELECT id, cat, sev, descr, rec, now() + due, st
FROM (
  VALUES 
    ((SELECT id FROM seed_primary_insts WHERE name = 'ABC Brokers'), 'Compliance', 'High', 'KYC file completeness below threshold','Remediate KYC files', INTERVAL '30 days','Open'),
    ((SELECT id FROM seed_primary_insts WHERE name = 'XYZ Capital'), 'RiskManagement', 'Medium', 'Missing scenario analysis documentation','Provide documentation', INTERVAL '14 days','InProgress'),
    ((SELECT id FROM seed_primary_insts WHERE name = 'SafeCustody Ltd'), 'Operations', 'Low', 'Backup job missing weekly report','Attach weekly report', INTERVAL '21 days','Open')
) AS t(id, cat, sev, descr, rec, due, st);

-- Interventions
INSERT INTO interventions(institution_id, type, intensity, date)
SELECT id, tp, inten, now() - offs
FROM (
  VALUES 
    ((SELECT id FROM seed_primary_insts WHERE name = 'ABC Brokers'), 'Onsite', 4, INTERVAL '20 days'),
    ((SELECT id FROM seed_primary_insts WHERE name = 'XYZ Capital'), 'Offsite', 2, INTERVAL '7 days')
) AS t(id, tp, inten, offs);

COMMIT;
