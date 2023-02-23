<h1 style="text-align: center;">ZENDESK PLUGIN FOR TRANSLATION</h1>

### **Description**

This plugin helps agent to translate the conversations into its native language.

<br />

### **Note**

- Env_name refers

  - **dev** (For Development)
  - **qa** (For QA)
  - **stage**(For Stage)
  - **prod** (For Production)

- To connect the local server with the zendesk agent portal we need to append **?zcli_apps=true** at the end of the zendesk agent portal url.

<br />

### **Installation Instructions**

- Clone this repository.
- Run **yarn install** or **npm i** to install app dependencies.

<br />

### **Instruction for running local server**

- In One terminal, run **yarn build:[Env_name]** or **npm run build:[Env_name]**.
- In Second terminal, run **yarn serve:[Env_name]** or **npm run serve:[Env_name]**.

<br />

### **Editor Setup**

- Make sure editor is updated to latest version.
- Install `prettier` vs code extension (using vscode command palette run `ext install esbenp.prettier-vscode`)
- Make `prettier` default code formatter in vscode.

<br />

### **Environment Variables**

- Need to create a environment files for each environment.
- Naming convention for the environment file as follows
  - **.env.[Env_name]**
- Make sure to place your all env files in the root directory of the project.
- Parameters to add in env files:
  - **BASE_URL** :- Base Url of the API endpoints of the respective environment.

<br />

### **Available Scripts**

- `yarn build:dev` :- Create development build using webpack and continuously watch for any changes.
- `yarn serve:dev` :- Start the local server pointing toward dev env.
