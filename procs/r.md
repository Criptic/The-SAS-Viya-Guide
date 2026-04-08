# R

Proc R enables us to submit R code as part of a SAS program or flow. This proc was introduced with SAS Viya 2026.03 and you can find more about in the [SAS Documenation](https://go.documentation.sas.com/doc/en/pgmsascdc/default/proc/n01ez000itdyxin1j52wz9emnnfq.htm) as well.

We are here going to learn all about the different integration points between SAS and R, talk about the different proc options, find out which R version you are using, which packages are available and dive into an advanced example that combines SAS, Python & R in one simple example.

The content of this page is also available as a [YouTube video on my channel](https://youtu.be/b5yY06drmpU).

Please note that in this guide we will not talk about how to enable Proc R as that has to be done by the SAS Administrator. If you are a SAS Administrator than please check out this [SAS Documenation](https://go.documentation.sas.com/doc/en/sasadmincdc/default/calsrvpgm/p1iu2rzpk1j1b4n1shfqxpqzyso4.htm) to understand how to install R in order for Proc R to use it.

## Step 1: Hello World from R

We are going to start things of by just printing a simple statement to the log:

```sas
proc r;
submit;
print("Hello from R — inside SAS!")
endsubmit;
run;
```

As you can see from the above we simply wrap our R code in a proc wrapper and place the code between a submit/endsubmit block.

This will print the following line to the log: *[1] "Hello from R — inside SAS!"*.

In addition there is one really interesting note in the log: *NOTE: R initialized.* - this is because R is run as a subprocess within your SAS session. This runtime behavior enables us to submit multiple proc r statements in a row and they will share the same session within R.

If we want to restart with a clean R environment we can simply do the following:
```sas
proc r restart;
submit;
# New Code
endsubmit;
run;
```

If we only want terminate our R session and do not need a new one - this is a good practise if you are fully done with processing in R to just release the resources, than just replace *restart* with *terminate*.

## Step 2: Understanding the R environment

An administrator can make multiple R environments available. A common pattern is to associate them with different compute contexts. Another method that is available but usually restricted is by changing the environment variable using SAS Code. Below is a short snippet that retrieves the value of variable and prints it to the SAS log.

```sas
* Understanding which R environment is currently in use;
%let rpath = %sysget(PROC_RPATH);
%put PROC_RPATH = &rpath.;
```

Another common topics is to understand which R packages are available in your environment and for that you can use this helper script which returns the list of available R packages and additional information as a SAS dataset.

```sas
proc r;
submit;
# installed.packages() returns a matrix — convert to data frame
pkgs <- as.data.frame(
    installed.packages()[, c("Package", "Version", "Priority", "Depends", "Imports", "License", "NeedsCompilation")],
    stringsAsFactors = FALSE,
    row.names = FALSE
)

# Tidy up: replace NA with empty string so SAS handles it cleanly
pkgs[is.na(pkgs)] <- ""

# Flag which packages are currently loaded in this session
pkgs$Loaded <- ifelse(pkgs$Package %in% loadedNamespaces(), "Yes", "No")

# Sort alphabetically
pkgs <- pkgs[order(pkgs$Package), ]

# Summary to log
cat("Total packages found:", nrow(pkgs), "\n")
cat("Packages loaded in session:", sum(pkgs$Loaded == "Yes"), "\n")

# Push to SAS WORK library
df2sd(pkgs, "r_packages", "work")
endsubmit;
run;
```

## Step 3: Interacting with SAS

In total there are nine methods available for the interaction with SAS from R. Here we will touch on a couple of them, but if you want to go even further please take a look at the [Callback Method SAS Documentation](https://go.documentation.sas.com/doc/en/pgmsascdc/default/proc/n00kj1yptvan02n12m9bupw5vbvr.htm).

The following functions are available:
- rplot, prints a graphh to the results
- renderImage, prints an image to the results
- sasfnc, calls a SAS function
- show, prints a R object to the results
- submit, run SAS code from R
- symget, retrieve the value of a SAS macro variable
- symput, create a SAS macro variable
- sd2df, move a SAS dataset into a R data frame
- df2sd, move a R data frame into a SAS dataset

## Step 4: Storing R Code

You might already have R code available that you now just want to submit through SAS. This can be done by using the *inFile* option in the proc R statement. In the code sample you'll find an example for both when it is stored in SAS Content and on the SAS Server (i.e. the file system).

```sas
* Filename example for SAS Content;
filename test filesrvc folderPath='/Users/gerdaw/My Folder/SAS-Code' filename='Hello-R.r';
* Filename example for SAS Server;
* filename test '/srv/nfs/kubedata/compute-landingzone/gerdaw/Hello-R.r';
proc r inFile=test;
    submit;
    endsubmit;
run;
```

## Step 5: SAS, Python & R

This code example highlights how SAS, Python & R can be combined for a unique combination of languages and their strengths. All in one unified workflow, easily moving data between them, visualizing results and communicating intermediate results using variables.

```sas
/*************************************************************
   Polyglot pipeline - sashelp.cars
   SAS Procedures, Python (sklearn) & R (ggplot2)
   Prerequisites:
     - Proc Python needs to be configured and enabled +
        numpy, pandas and sklearn need to be installed
     - Proc R needs to be configured and eanabled +
        ggplot2, dplyr and scales need to be installed
*************************************************************/
* Step 1: SAS - clean and summarise sashelp.cars;
data work.cars_clean;
  set sashelp.cars;
  where MSRP is not missing
    and Horsepower is not missing
    and EngineSize is not missing
    and MPG_City is not missing
    and MPG_Highway is not missing
    and Weight is not missing;
run;

proc means data=work.cars_clean N MEAN STD MIN MAX;
  class Origin;
  var MSRP Horsepower EngineSize;
run;

proc freq data=work.cars_clean;
  tables Origin / noCum;
run;


* Step 2: Proc Python - feature engineering + sklearn model;
proc python;
submit;
import pandas as pd
import numpy  as np
from sklearn.linear_model    import LinearRegression
from sklearn.model_selection  import train_test_split
from sklearn.metrics          import r2_score, mean_absolute_error
from sklearn.preprocessing    import StandardScaler

# Pull SAS dataset directly into a Pandas DataFrame
df = SAS.sd2df("work.cars_clean")

# Feature engineering
df["MPG_Combined"]  = (df["MPG_City"] + df["MPG_Highway"]) / 2
df["PowerToWeight"] =  df["Horsepower"] / df["Weight"]
df = pd.get_dummies(df, columns=["Origin"], drop_first=True)
df.columns = [c.replace(" ", "_") for c in df.columns]

FEATURES = ["Horsepower", "EngineSize", "MPG_Combined",
            "PowerToWeight", "Weight", "Origin_Europe", "Origin_USA"]
TARGET = "MSRP"
X, y = df[FEATURES], df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
scaler  = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

r2  = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
print(f"R²  : {r2:.3f}  |  MAE : ${mae:,.0f}")

# Save model metrics to SAS macro variables
SAS.symput("py_r2",  str(round(r2,  3)))
SAS.symput("py_mae", str(int(round(mae, 0))))

# Reconstruct origin label from one-hot columns
origin_raw = df.loc[y_test.index]
results = pd.DataFrame({
    "Actual"   : y_test.values,
    "Predicted": y_pred,
    "Origin"   : np.where(
        origin_raw["Origin_Europe"] == 1, "Europe",
        np.where(origin_raw["Origin_USA"] == 1, "USA", "Asia")
    )
})

# Write predictions back to SAS WORK library
SAS.df2sd(results, "cars_preds")

endsubmit;
run;

* Verify metrics and preview predictions;
title "Model R² = &py_r2.  |  MAE = $&py_mae.";
proc print data=work.cars_preds(obs=10);
run;


* Step 3: Proc R - ggplot2 visualisations;
proc r;
submit;
library(ggplot2)
library(dplyr)
library(scales)

# Pull predictions dataset and macro metrics directly from SAS
preds   <- sd2df("cars_preds", "work")
r2_val  <- symget("py_r2")
mae_val <- symget("py_mae")

preds <- preds |> mutate(Residual = Predicted - Actual)

subtitle_txt <- paste0(
    "Linear regression  |  R² = ", r2_val,
    "  |  MAE = $", format(as.integer(mae_val), big.mark = ",")
)

# Plot 1: predicted vs actual, faceted by origin
p1 <- ggplot(preds, aes(x = Actual, y = Predicted, colour = Residual)) +
    geom_abline(slope = 1, intercept = 0, linetype = "dashed", colour = "#888780", linewidth = 0.5) +
    geom_point(alpha = 0.75, size = 2.2) +
    scale_colour_gradient2(low = "#185FA5", mid = "#D3D1C7", high = "#D85A30", midpoint = 0, name = "Residual ($)") +
    scale_x_continuous(labels = dollar_format()) +
    scale_y_continuous(labels = dollar_format()) +
    facet_wrap(vars(Origin), ncol = 3) +
    labs(title = "Predicted vs actual MSRP by origin", subtitle = subtitle_txt, x = "Actual MSRP", y = "Predicted MSRP") +
    theme_minimal(base_size = 12) +
    theme(strip.text = element_text(face = "bold"), legend.position = "bottom", panel.grid.minor = element_blank())

# Render directly to SAS Studio Results panel
rplot(p1, filename = "cars_predicted_vs_actual.png")

# Plot 2: residual distribution by origin
p2 <- ggplot(preds, aes(x = Residual, fill = Origin)) +
    geom_histogram(bins = 25, colour = "white", alpha = 0.85) +
    scale_fill_manual(values = c(Asia = "#534AB7", Europe = "#1D9E75", USA = "#D85A30")) +
    scale_x_continuous(labels = dollar_format()) +
    facet_wrap(vars(Origin)) +
    labs(title = "Residual distribution by origin", x = "Predicted − actual MSRP", y = "Count") +
    theme_minimal(base_size = 12) +
    theme(legend.position = "none")

rplot(p2, filename = "cars_residuals.png")

# Bonus: show summary stats table in Results
summary_tbl <- preds |>
    group_by(Origin) |>
    summarise(
        N = n(),
        Mean_Actual = round(mean(Actual),    0),
        Mean_Pred = round(mean(Predicted), 0),
        MAE_Origin = round(mean(abs(Residual)), 0),
        .groups = "drop")

show(summary_tbl, title = "Per-origin model performance")

endsubmit;
run;
```