import{ref, onMounted, onUnmounted} from 'vue'
export const useResizeHook = () => {
    let time:NodeJS.Timeout;

    const width = ref(0);
    const height = ref(0);

    function update(){
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    }
  

    onMounted(()=>{
        window.addEventListener('resize', ()=>{
            clearTimeout(time);
            time = setTimeout(update, 100);
        })
    })
    
    onUnmounted(()=>{
        window.removeEventListener('resize', ()=>{
            clearTimeout(time);
            time = setTimeout(update, 100);
        })
    })

    return{
        width,
        height
    }

}