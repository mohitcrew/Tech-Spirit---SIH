import os
import re

def rep(file, old, new):
    with open(file, 'r', encoding='utf-8') as f: c = f.read()
    with open(file, 'w', encoding='utf-8') as f: f.write(c.replace(old, new))

rep('src/assessments/assessments.controller.ts', "Role", "")
rep('src/auth/auth.service.ts', "designation:d.designation", "designation:d.designation, skills: '', interests: ''")
rep('src/common/guards/roles.guard.ts', "'./roles.decorator'", "'../decorators/roles.decorator'")

with open('src/courses/courses.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("...d,trainerId:user.id", "...d,learningObjectives:d.learningObjectives.join('\\n'),trainerId:user.id")
c = c.replace("data:d}", "data:{...d, learningObjectives:d.learningObjectives ? d.learningObjectives.join('\\n') : undefined}}")
with open('src/courses/courses.service.ts', 'w', encoding='utf-8') as f: f.write(c)

with open('src/users/users.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("...d", "...d, skills: d.skills ? d.skills.join(',') : undefined, interests: d.interests ? d.interests.join(',') : undefined")
with open('src/users/users.service.ts', 'w', encoding='utf-8') as f: f.write(c)
