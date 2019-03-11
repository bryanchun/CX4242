// Databricks notebook source
// MAGIC %md
// MAGIC #### Q2 - Skeleton Scala Notebook
// MAGIC This template Scala Notebook is provided to provide a basic setup for reading in / writing out the graph file and help you get started with Scala.  Clicking 'Run All' above will execute all commands in the notebook and output a file 'examplegraph.csv'.  See assignment instructions on how to to retrieve this file. You may modify the notebook below the 'Cmd2' block as necessary.
// MAGIC 
// MAGIC #### Precedence of Instruction
// MAGIC The examples provided herein are intended to be more didactic in nature to get you up to speed w/ Scala.  However, should the HW assignment instructions diverge from the content in this notebook, by incident of revision or otherwise, the HW assignment instructions shall always take precedence.  Do not rely solely on the instructions within this notebook as the final authority of the requisite deliverables prior to submitting this assignment.  Usage of this notebook implicitly guarantees that you understand the risks of using this template code. 

// COMMAND ----------

/*
DO NOT MODIFY THIS BLOCK
This assignment can be completely accomplished with the following includes and case class.
Do not modify the %language prefixes, only use Scala code within this notebook.  The auto-grader will check for instances of <%some-other-lang>, e.g., %python
*/
import org.apache.spark.sql.functions.desc
import org.apache.spark.sql.functions._
case class edges(Source: String, Target: String, Weight: Int)
import spark.implicits._

// COMMAND ----------

/* 
Create an RDD of graph objects from our toygraph.csv file, convert it to a Dataframe
Replace the 'examplegraph.csv' below with the name of Q2 graph file.
*/

var df = spark.read.textFile( "/FileStore/tables/bitcoinotc.csv") // "/FileStore/tables/examplegraph.csv"
  .map(_.split(","))
  .map(columns => edges(columns(0), columns(1), columns(2).toInt)).toDF()
display(df)

// COMMAND ----------

// e.g. eliminate duplicate rows
df = df.distinct()
df.count()

// COMMAND ----------

// e.g. filter nodes by edge weight >= supplied threshold in assignment instructions
df = df.filter($"Weight" >= 5)
display(df)

// COMMAND ----------

// find node with highest weighted-in-degree, if two or more nodes have the same weighted-in-degree, report the one with the lowest node id
val indf = df.groupBy($"Source" as "node").agg(sum($"Weight") as "weighted-out-degree")
// find node with highest weighted-out-degree, if two or more nodes have the same weighted-out-degree, report the one with the lowest node id
val outdf = df.groupBy($"Target" as "node").agg(sum($"Weight") as "weighted-in-degree")

val joined = indf.join(right=outdf, usingColumns=Seq("node"), joinType="full_outer").orderBy("node")
val nonnull = joined.na.fill(0, Seq("weighted-out-degree", "weighted-in-degree"))
// find node with highest weighted-total degree, if two or more nodes have the same weighted-total-degree, report the one with the lowest node id
val totaldf = nonnull.withColumn("weighted-total-degree", col("weighted-in-degree") + col("weighted-out-degree"))

// totaldf.agg(max("weighted-out-degree")).show
// val maxin = totaldf.orderBy(desc("weighted-in-degree"), asc("node")).limit(1)
// val maxout = totaldf.orderBy(desc("weighted-out-degree"), asc("node")).limit(1)
// val maxtotal = totaldf.orderBy(desc("weighted-total-degree"), asc("node")).limit(1)

val cols = Seq("weighted-in-degree", "weighted-out-degree", "weighted-total-degree")
val vs = cols.map(colname =>
                     totaldf.orderBy(desc(colname), asc("node")).limit(1).select(col("node")).as[String].collect()(0))
val ds = cols.map(colname =>
          totaldf.orderBy(desc(colname), asc("node")).limit(1).select(col(colname)).as[String].collect()(0))
val cs = List("i", "o", "t")

// COMMAND ----------

/*
Create a dataframe to store your results
Schema: 3 columns, named: 'v', 'd', 'c' where:
'v' : vertex id
'd' : degree calculation (an integer value.  one row with highest weighted-in-degree, a row w/ highest weighted-out-degree, a row w/ highest weighted-total-degree )
'c' : category of degree, containing one of three string values:
                                                'i' : weighted-in-degree
                                                'o' : weighted-out-degree                                                
                                                't' : weighted-total-degree
- Your output should contain exactly three rows.  
- Your output should contain exactly the column order specified.
- The order of rows does not matter.
                                                
A correct output would be:

v,d,c
4,15,i
2,20,o
2,30,t

whereas:
- Node 2 has highest weighted-out-degree with a value of 20
- Node 4 has highest weighted-in-degree with a value of 15
- Node 2 has highest weighted-total-degree with a value of 30

*/
// val result = List(vs, ds, cs).transpose.toDF("v", "d", "c")

// TODO: Matrix conversion is not working
val result = Seq(
  (vs(0), ds(0), cs(0)),
  (vs(1), ds(1), cs(1)),
  (vs(2), ds(2), cs(2))
).toDF("v", "d", "c")
// val result = sc.parallelize(vs zip ds zip cs).toDF(Seq("v", "d", "c"): _*)
//.toDF("v", "d", "c")
// spark.createDataFrame(List(vs, ds, cs).transpose)

// COMMAND ----------

// TODO: bitcoinotc.csv 
display(result)

// COMMAND ----------


