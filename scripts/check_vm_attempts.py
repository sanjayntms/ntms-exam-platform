import subprocess

ssh_cmd = [
    "ssh",
    "-i", "ntmslinux.pem",
    "-o", "ConnectTimeout=15",
    "-o", "StrictHostKeyChecking=no",
    "vmadmin@40.81.226.111",
    "cd ~/ntms-exam-platform/backend && node -e \"const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.examAttempt.findMany({ include: { user: true, exam: true, room: true } }).then(atts => console.log(JSON.stringify(atts.map(a => ({ id: a.id, candidateName: a.candidateName, userEmail: a.user ? a.user.email : null, userName: a.user ? a.user.name : null, examCode: a.exam ? a.exam.code : null, score: a.scorePercentage, passed: a.passed, startedAt: a.startedAt })), null, 2))).finally(() => p.\\$disconnect());\""
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
