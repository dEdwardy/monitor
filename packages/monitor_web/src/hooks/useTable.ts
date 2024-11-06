import { ref, reactive, watch, toRefs, computed, Ref, ComputedRef } from 'vue'
export interface IPageOptions {
    current: number
    size: number
    [propName: string]: any
}
export interface ISearchOptions {
    current?: number
    size?: number
    [propName: string]: any
}
export interface IList {
    list: any[]
    total: number
}
// export interface IGetList {
//   (): Promise<IList>;
// }
export type TGetList = () => Promise<IList>
export interface IResponse {
    list: Ref<any[]> | ComputedRef<any[]>
    pageOptions: IPageOptions
    total: Ref<number> | ComputedRef<number>
    loading: Ref<boolean>
    searchOptions: ISearchOptions
    search: () => Promise<any>
    error: any
}
export interface IConfig {
    backendPagination: boolean
    size?: number
    current?: number
}
export function useTable(
    getList,
    options: ISearchOptions = {},
    config: IConfig = { backendPagination: true, current: 1, size: 10 },
): IResponse {
    const searchOptions = options ? reactive(options) : reactive({})
    const pageOptions = reactive({
        current: config?.current ?? 1,
        size: config?.size ?? 10,
        ...toRefs(searchOptions),
    })
    const loading = ref(false)
    const total = ref(0)
    const list = ref([])
    const error = ref()
    const search = () => {
        console.error('search')
        loading.value = true
        return getList(pageOptions)
            .then((res) => {
                list.value = res.list
                total.value = res.total
            })
            .catch((e) => (error.value = e))
            .finally(() => {
                loading.value = false
            })
    }
    search()
    watch(error, (err) => {
        if (err) {
            console.error('出错辣', err)
            loading.value = false
        }
    })
    // 默认后端分页
    if (config.backendPagination) {
        // watch(
        //     () => pageOptions.size,
        //     () => {
        //         pageOptions.current = 1
        //         search()
        //     },
        // )
        // watch(
        //     () => pageOptions.current,
        //     () => {
        //         search()
        //     },
        // )
        watch(
            [() => pageOptions.current, () => pageOptions.size],
            ([, s1], [, s2], onCleanup) => {
                let stop = false
                onCleanup(() => {
                    if (s1 !== s2) {
                        stop = true
                    }
                })
                if (s1 !== s2) {
                    pageOptions.current = 1
                }
                if (stop) {
                    console.error('xxxxxxxx')
                    return
                } else {
                    console.error('yyyyyyyyyyyyy')
                }
                search()
            },
            { flush: 'sync' },
        )
    } else {
        watch(
            () => pageOptions.size,
            () => {
                pageOptions.current = 1
            },
        )
    }

    const computedList = computed(() => {
        if (config.backendPagination) {
            return []
        } else {
            return list.value.slice((pageOptions.current - 1) * pageOptions.size, pageOptions.current * pageOptions.size)
        }
    })
    if (config.backendPagination) {
        return {
            list,
            pageOptions,
            total,
            loading,
            searchOptions,
            search,
            error,
        }
    } else {
        return {
            list: computedList,
            pageOptions,
            total,
            loading,
            searchOptions,
            search,
            error,
        }
    }
}
