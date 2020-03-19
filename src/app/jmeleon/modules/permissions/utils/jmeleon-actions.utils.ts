export default class JMeleonActionsUtils {

     static resolveVars = (path: string, dict: object): string => {
         const keys = Object.keys(dict);
         keys.forEach(key => path = path.replace(key, dict[key]));
         return path;
     }
















}
