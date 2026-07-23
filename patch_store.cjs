const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf8');

const storeActions = `
  addTender: (tender) => set(state => ({
    tenders: [
      ...state.tenders,
      {
        ...tender,
        id: \`tender-\${Date.now()}\`,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        applications: [],
      }
    ]
  })),

  applyTender: (tenderId, appData) => set(state => ({
    tenders: state.tenders.map(t => {
      if (t.id === tenderId) {
        return {
          ...t,
          applications: [
            ...t.applications,
            {
              ...appData,
              id: \`app-\${Date.now()}\`,
              status: 'PENDING',
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    })
  })),

  approveTenderApplication: (tenderId, applicationId) => set(state => ({
    tenders: state.tenders.map(t => {
      if (t.id === tenderId) {
        return {
          ...t,
          status: 'CLOSED',
          applications: t.applications.map(app => ({
            ...app,
            status: app.id === applicationId ? 'APPROVED' : 'REJECTED'
          }))
        };
      }
      return t;
    })
  })),
`;

code = code.replace('setCurrentUser: (user) => set({ currentUser: user }),', storeActions + '\n  setCurrentUser: (user) => set({ currentUser: user }),');

fs.writeFileSync('src/store/index.ts', code);
