import { supabase } from '@/supabaseClient'
import type { IMessage, IConservation} from '@/interfaces'


export const useMessageService = () => {
    const defineConservation = async(conservationObj:IConservation) =>{
        const {data, error}  = await supabase.from('conservation').select('id').eq('id', conservationObj.id).limit(1)
        if(error) console.log(error.message)
        console.log(data)
        if(data && data?.length > 0) return

        await supabase.from('conservation').insert(conservationObj)
      
        
    }
    
    const sendPrivateMessage = async(msgObj:IMessage) =>{
        
      const {data, error}  = await supabase.from('messages').insert(msgObj).select()
      if(error) throw error
      console.log(data)

    }


    const getPrivateMessages = async(conservation_id:string) =>{
        const {data, error} = await supabase.from('messages').select().eq('chat_id', conservation_id)
        if(error) throw error
        return data
    }
    return{
        sendPrivateMessage,
        getPrivateMessages,
        defineConservation
    }
}