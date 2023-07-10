import { taggedSum } from "daggy";
import { useState } from "react";
import { liftFC as DO } from "fantasy-frees/src/free";

export const Result = taggedSum('Result', {
    success: ['data'],
    error: ['error']
})

export const CommonActions = taggedSum('CommonActions', {
    error: ['error'],
    just: ['just']
})

export const DataSource = taggedSum('DataSource', {
    update: ['data'],
    getData: []
})

export const ListActions = taggedSum('ListActions', {
    fetchData: ['params'],
    beginLoading: [],
    finishLoading: [],
    updateData: ['data'],
})

export const buildParamsActions = taggedSum('buildParamsActions', {
    buildParams: ['serachValues', 'pagination']
})
export const buildParamsScript = (serachValues, pagination) => DO(buildParamsActions.buildParams(serachValues, pagination))

export const listRefreshScript = params => DO(ListActions.beginLoading)
    .andThen(DO(ListActions.fetchData(params)))
    .chain(result => result.cata({
        success: data => DO(ListActions.update(data))
            .andThen(DO(ListActions.finishLoading)),
        error: error => CommonActions.error(error)
    }))

export const useSearchListPage = (
    searchFormInterpreter,
    listInterpreter,
    pageInterpreter,
    buildParamsInterpreter
) => {

    const justserachValues = serachValues => searchFormInterpreter(CommonActions.just(serachValues))

    const justPagination = pagination => pageInterpreter(CommonActions.just(pagination))

    const buildParams = (serachValues, pagination) => buildParamsInterpreter(DO(buildParamsActions.buildParams(serachValues, pagination)))

    const getPagination = pageInterpreter(DO(DataSource.getData))

    const getserachValues = searchFormInterpreter(DO(DataSource.getData))

    const reloadList = params => listInterpreter(listRefreshScript(params))


    const onFilterChange = serachValues => justserachValues(serachValues)
        .map(serachValues => pagination => buildParams(serachValues, pagination))
        .ap(getPagination)
        .chain(reloadList)

    const onPaginationChange = pagination => justPagination(pagination)
        .map(pagination => serachValues => buildParams(serachValues, pagination))
        .ap(getserachValues)
        .chain(reloadList)

    return { onFilterChange, onPaginationChange }
}