export const loadProgram = (program) => {
  const title = program.config?.initTitle || program.name;
  const uniqueId = (new Date()).getTime().toString() + (
    Math.floor(Math.random() * 100)).toString();
    
  return { pId: uniqueId, title: title, ...program };
};

export const updateProgramsData = (data, newProgram) => {
  let newData = { ...data };
  newData[newProgram.pId] = newProgram;
  return newData;
};

export const updateAppsInstances = (data, newProgram) => {
  let newInstances = { ...data };
  const key = newProgram.id;
  if(!(key in data)) newInstances[key] = [];
  newInstances[key] = [...newInstances[key], newProgram.pId];
  return newInstances;
};

export const removeProgram = (data, pId) => {
  const newData = {...data};
  delete newData[pId];
  return newData;
};

export const removeAppInstance = (data, id, pId) => {
  const newData = {};
  newData[id] = data[id].filter(instanceId => instanceId !== pId);
  return Object.assign(data, newData);
};