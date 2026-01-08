---
id: intro
sidebar_label: 'Intro'
sidebar_position: 1
---
# The PROC Guide

Here I am adding guides around some of the Procs available in SAS Viya. At the top of each Proc will be a link to the corresponding page in the SAS Documentation. This is not intended as a replacement to the SAS Documentation, but rather my unique spin of a guide to procs.

In general if you out for programming documentation I can highly recommend the following pages as quick reference to find things:
- [Procs by Name](https://go.documentation.sas.com/doc/en/pgmsascdc/default/allprodsproc/procedures.htm)
- [CAS Action Sets by Name](https://go.documentation.sas.com/doc/en/pgmsascdc/default/allprodsactions/actionSetsByName.htm)
- [SAS Language Elements by Name](https://go.documentation.sas.com/doc/en/pgmsascdc/default/allprodsle/titlepage.htm)

## A Note on Syntax

The code formatted here is done specifically for maximum readability, because of the I utilize camelCase for all keywords, use spaces around operators & after commas and I always specify *work.* to be clear on where the data is stored.

## A Note on Data

For the examples used the dataset will either be provided as part of a data step or the datasets will be pulled from the included libraries [SASHELP](https://go.documentation.sas.com/doc/en/statug/latest/statug_sashelp_sect001.htm) & [SAMPSIO](https://support.sas.com/kb/57/addl/fusion_57672_1_sampsio_data_sets.pdf).