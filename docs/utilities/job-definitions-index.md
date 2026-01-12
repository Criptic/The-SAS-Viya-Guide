# SAS Job Definition Overview

This utility enables you to index all of the SAS Job Definitions within a SAS Viya environment and turn it into a data set.

This script is available as a SAS Script that you can download [from here](../../static/code/job-definitions-macro.sas).
Or as a SAS Studio Custom Step that you can download [from here](https://github.com/sassoftware/sas-studio-custom-steps/tree/main/Get%20SAS%20Job%20Definition%20Information). This repository also includes the transfer package for a SAS Visual Analytics report.

If you are interested only in the code behind the SAS Studio Custom step than you can download that [here](../../static/code/job-definitions-step.sas).

# Scratchpad

This utility was build during a YouTube livestream - as such I keep a Scratchpad of the notes that was written up during the livestream. If you are interested in the VoD you can find it [here](https://youtube.com/live/6HjixEGOSwE?feature=share).

## Goal

SAS Jobs (SAS Job Definitions)
- The a list of all of the jobs in the environment - done
- Add information about eacch of the jobs - done
- Turn it into a macro - done
- Turn it into a custom step - done
- Creating SAS Visual Analytics report for the data  - done

## Ideas & Thoughts

Naming Idea: Indexing SAS Job Definitions (IJD)

All data is retrievable from the /jobDefinitions/definitions endpoint (https://developer.sas.com/rest-apis/jobDefinitions/getJobDefinitions).
Meaning we could retrieve with a very high limit and do a small loop or we could do low limit and with more loop iterations.

### Output Table structure
job_definition_index:
id, name, creationTimeStamp, modifiedTimeStamp, createdBy, modeifiedBy, type, description, has_code, code_line_count

job_definition_parameters:
id, parameter_name, parameter_type, parameter_label, is_required, default_value

job_definition_properties - except form/prompts:
id, property_name, property_value, has_html_form, has_xml_prompt, has_json_prompt

### Custom Step Design

- Connect output tables (three index, params and props) (default see above) - done
- adjust limit (default 250) - not doing it
- Introduction text - done
- About page - done
- CAS promotion and save - done

CAS promotion:
1. Check the result table engine - all three &_IJD_OUTTABLE_1_ENGINE. eq CAS - done
2. Check CAS library name - %let _IJD_OUTTABLE_1_LIB=%sysfunc(getlcaslib(&_IJD_OUTTABLE_1_LIB));  - done

### Report Design

Page 1: Overview - done
Introduction to what SAS Job Definitions are
Total Number of Job Definitions in Environment
Timeline of jobs by creation

Page 2: Job Definitions Details - done
Filter: creator modifier creationTS modificationTS has_code has_json has_xml has_form 
Table with all of job_definition_index columns

Page 3: Parameter Details (hidden) - done
Table with all of job_definition_parameters columns

Page 4: Property Details (hidden) - done
Text explaining that the prompts and forms code is not saved
Table with all of job_definition_properties columns