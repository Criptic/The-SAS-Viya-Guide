# ODS Result Tables as Tables

In this quick tip we will take a look at how to get the tables that are printed to the ODS Results (or *Results* tab) as tables in SAS that we can continue to work with.

When using a proc they often produce tables as part of their results that contain valuable information that can be leveraged for documentation, further processing or automation.

We are going to look at this example by utilizing proc contents - [SAS Documentation](https://go.documentation.sas.com/doc/en/pgmsascdc/default/proc/n1hqa4dk5tay0an15nrys1iwr5o2.htm) - which by default does not create any output data, but prints a bunch of tables to the results.

```sas
proc contents data = sashelp.class;
quit;
```

Below is a screenshot of the three result tables.

[ODS Result Tables as Tables 1](../../static/img/quick-tips/ODS-Result-Tables-as-Table-Output-1.png)

Our goal now is to get this table as a SAS data set. To identify how we can do that we are to have a statement before and after the proc to turn on the information about the output. More about this specific statement in the [SAS Documentation](https://go.documentation.sas.com/doc/en/pgmsascdc/default/odsproc/p1fpt3uuow90o3n155hs7bp1mo7f.htm).

```sas
* Activate the tracing to find all table names;
ods trace on;

proc contents data = sashelp.class;
quit;

* Deactivate the tracing again for subsquent calls to reduce the log;
ods trace off;
```

And here is the log output from that:
```txt
Output Added:
-------------
Name:       Attributes
Label:      Attributes
Template:   Base.Contents.Attributes
Path:       Contents.DataSet.Attributes
-------------
Output Added:
-------------
Name:       EngineHost
Label:      Engine/Host Information
Template:   Base.Contents.EngineHost
Path:       Contents.DataSet.EngineHost
-------------
Output Added:
-------------
Name:       Variables
Label:      Variables
Template:   Base.Contents.Variables
Path:       Contents.DataSet.Variables
-------------
```

Now the way to read this is fairly simple, the *Name* will be what we need in order to save this output to a table and the *Label* is the text that is displayed in the results as a heading of the table so we can quickly identify the correct table we want. If you have a product that produces the same table multiple times than you have to use the *Path* value instead.

Now we can make use of the [ODS Output] statement - [SAS Documentation](https://go.documentation.sas.com/doc/en/pgmsascdc/default/odsug/p0oxrbinw6fjuwn1x23qam6dntyd.htm) - to save the result to a table. My personal preference is to always move them just above the quit statement. The syntax is simple it is either *Name* = library.table or instead of the *Name* you can also specify the *Path*.

```sas
proc contents data = sashelp.class;
    ods output
        Attributes = work.Attributes
        EngineHost = work.Engine_Host
        Contents.DataSet.Variables = work.Variables;
quit;
```

We do not need to specify all of them, only the once we are interested in. We can also note that once we know the *Name/Path* we no longer need the *ods trace* statement and we can also mix and match *Name* and *Path* as we please.