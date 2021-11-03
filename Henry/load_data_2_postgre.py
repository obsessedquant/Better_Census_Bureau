# write python program to connect to postgres and load data to postgre database
#
# conda install psycopg2 - PostgresSQL database adapter for Python
#
#
#
# 
#

import pandas as pd
import os
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine
import codecs

# Load .env enviroment variables into the notebook
load_dotenv()
# Get the postgres connection information from os file. 


DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('postrgres_user')
DB_PASS = os.getenv('postrgres_pass')

# print(DB_PASS)

SVI2018_df = pd.read_csv('../Data/SVI2018_US.csv',sep=',',lineterminator='\r',header=0,encoding='latin1',low_memory=False)
Texas_county_df = pd.read_csv('../Data/Texas_COUNTY.csv',sep=',',lineterminator='\r',header=0,encoding='latin1',low_memory=False)
texas_houston_df = pd.read_csv('../Data/Texas_Houston.csv',sep=',',lineterminator='\r',header=0,encoding='latin1',low_memory=False)
texas_df = pd.read_csv('../Data/Texas.csv',sep=',',lineterminator='\r',header=0,encoding='latin1',low_memory=False)
# ('Real_acct_owner/real_acct.txt', sep='\t',lineterminator='\r',header=0,encoding='latin1',low_memory=False)
#doc = codecs.open('Real_acct_owner/real_acct.txt','rU','UTF-16')
#real_acct_df = pd.read_csv(doc,sep='\t',header=1)
#dept_df = pd.read_csv('data/dept_emp.csv')
#dept_manager_df = pd.read_csv('data/dept_manager.csv')
#employees_df = pd.read_csv('data/employees.csv')
#salaries_df = pd.read_csv('data/salaries.csv')
#titles_df = pd.read_csv('data/titles.csv')


# # sqlachemy

engine = create_engine(f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/BCB')

# # load df to database
SVI2018_df.to_sql('SVI2018_US',engine,index=False,if_exists='append')
Texas_county_df.to_sql('TEXAS_COUNTY',engine,index=False,if_exists='append')
texas_houston_df.to_sql('TEXAS_HOUSTON',engine,index=False,if_exists='append')
texas_df.to_sql('TEXAS',engine,index=False,if_exists='append')

