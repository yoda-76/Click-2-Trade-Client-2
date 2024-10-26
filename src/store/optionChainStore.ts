import create from 'zustand';

const optionsChainStore = (set: any) => ({
    OptionChain: <any>[],
    setOptionChain: (data:any) => {
        set(() => ({
            OptionChain: data,
        }))
    }
})

const useOptionChainStore = create(
    optionsChainStore
)


export default useOptionChainStore;