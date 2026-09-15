import os
import re

for root, _, files in os.walk('src'):
    for f in files:
        if not f.endswith('.ts') or 'node_modules' in root: continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as file: content = file.read()
        
        # fix the roles
        content = content.replace('@Roles(.ADMIN)', '@Roles(Role.ADMIN)')
        content = content.replace('@Roles(.TRAINER)', '@Roles(Role.TRAINER)')
        content = content.replace('@Roles(.TRAINEE)', '@Roles(Role.TRAINEE)')
        content = content.replace('@Roles(.ADMIN,.TRAINER)', '@Roles(Role.ADMIN, Role.TRAINER)')
        content = content.replace('@Roles(.ADMIN,.TRAINER,.TRAINEE)', '@Roles(Role.ADMIN, Role.TRAINER, Role.TRAINEE)')
        content = content.replace('roles: []', 'roles: Role[]')
        
        # fix comparisons
        content = content.replace('=== .ADMIN', '=== Role.ADMIN')
        content = content.replace('=== .TRAINER', '=== Role.TRAINER')
        content = content.replace('=== .TRAINEE', '=== Role.TRAINEE')
        content = content.replace('!== .ADMIN', '!== Role.ADMIN')
        content = content.replace('!== .TRAINER', '!== Role.TRAINER')
        content = content.replace('!== .TRAINEE', '!== Role.TRAINEE')
        
        # auth service fixes
        content = content.replace('role:.TRAINEE', 'role:Role.TRAINEE')
        content = content.replace('status:.ACTIVE', 'status:UserStatus.ACTIVE')
        content = content.replace('status:.PENDING', 'status:UserStatus.PENDING')
        content = content.replace('role?:', 'role?:string')
        
        # courses fixes
        content = content.replace('status:.PUBLISHED', 'status:CourseStatus.PUBLISHED')
        content = content.replace('status:.DRAFT', 'status:CourseStatus.DRAFT')
        content = content.replace('status:.ARCHIVED', 'status:CourseStatus.ARCHIVED')
        content = content.replace('level:.BEGINNER', 'level:CourseLevel.BEGINNER')
        content = content.replace('level:.INTERMEDIATE', 'level:CourseLevel.INTERMEDIATE')
        content = content.replace('level:.ADVANCED', 'level:CourseLevel.ADVANCED')
        
        # ensure enums are imported correctly without the  character
        content = content.replace('', '')
        
        # fix empty imports that were left
        content = re.sub(r'import\s*{\s*}\s*from\s*\'\.\./\.\./common/enums\';', '', content)
        content = re.sub(r'import\s*{\s*}\s*from\s*\'\.\./common/enums\';', '', content)

        with open(path, 'w', encoding='utf-8') as file: file.write(content)
