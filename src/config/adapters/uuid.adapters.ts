import { v4 as uuidV4} from 'uuid';
export class UuidAdapters {
   public static v4() {
      return uuidV4();
   }
}