import create from 'zustand';

const optionsChainDashboardStore = (set: any) => ({
    OptionChainDashboard: <any>[],
    setOptionChainDashboard: (data:any) => {
        set(() => ({
            OptionChainDashboard: data,
        }))
    }
})

const useOptionChainDashboardStore = create(
    optionsChainDashboardStore
)


export default useOptionChainDashboardStore;