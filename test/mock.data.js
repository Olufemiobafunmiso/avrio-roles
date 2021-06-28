const create_role = {
    workspace_id: 26,
    email: 'abtesting@example.com',
    role_name: 'AB GUYSTT',
    role_description: 'to manage my AB stuffTT',
    permissions: {
        '1': true,
        '2': true,
        '3': true
    },
    user: {
        id: 46,
        first_name: 'AB',
        last_name: 'Testing',
        uuid: 'c0cf8def-7dae-43ed-9614-4c39e2f4cc2f',
        email: 'abtesting@example.com'},
        role: {
            isOwnerRole: [{
                    id: 1,
                    name: 'owner',
                    description: null,
                    workspaces_id: null,
                    created_by_id: 1,
                    deletedAt: null
                },
                {
                    id: 19,
                    name: 'Switch UP AB guys',
                    description: 'Changing the game',
                    workspaces_id: null,
                    created_by_id: 46,
                    deletedAt: null
                }
            ]
        }
    }

const view_roles = {
    user: {
        id: 46,
        first_name: 'AB',
        last_name: 'Testing',
        uuid: 'c0cf8def-7dae-43ed-9614-4c39e2f4cc2f',
        email: 'abtesting@example.com'
    },
    workspace_id: 26,
    role: {
        isOwnerRole: [{
                id: 1,
                name: 'owner',
                description: null,
                workspaces_id: null,
                created_by_id: 1,
                deletedAt: null
            },
            {
                id: 19,
                name: 'Switch UP AB guys',
                description: 'Changing the game',
                workspaces_id: null,
                created_by_id: 46,
                deletedAt: null
            }
        ]
    },
    email: 'abtesting@example.com'
}

const assign_role ={ workspace_id: 26,
    invitee_email: 'loremIpsum@example.com',
    role_id: 19,
    user:
     { id: 46,
       first_name: 'AB',
       last_name: 'Testing',
       uuid: 'c0cf8def-7dae-43ed-9614-4c39e2f4cc2f',
       email: 'abtesting@example.com',
       auth_id: 'c465148df0',
       picture: null,
       password:
        '$2b$10$6UOclEpBFulYmZ5ptn2Ogu2c0Md9m8jrfDNJqG15ql3u1/LoVYQtu',
       verified: true },
       role: {
        isOwnerRole: [{
                id: 1,
                name: 'owner',
                description: null,
                workspaces_id: null,
                created_by_id: 1,
                deletedAt: null
            },
            {
                id: 19,
                name: 'Switch UP AB guys',
                description: 'Changing the game',
                workspaces_id: null,
                created_by_id: 46,
                deletedAt: null
            }
        ]
    } }


module.exports = {create_role,view_roles,assign_role};