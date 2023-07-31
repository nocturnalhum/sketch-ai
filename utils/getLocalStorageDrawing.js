export default function getLocalStorageDrawing() {
  const savedActions = localStorage.getItem('actions');
  const savedPosition = localStorage.getItem('currentPosition');
  const actionsArray = savedActions ? JSON.parse(savedActions) : null;
  const actionsPos = savedPosition ? JSON.parse(savedPosition, 10) : null;
  return actionsArray && actionsPos ? actionsArray[actionsPos] : null;
}
