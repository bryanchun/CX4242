package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;

public class Q4 {
  
  private static final String tmpPath = "tempOutput4";

  public static class DegreeDifferenceMapper
      extends Mapper<Object, Text, IntWritable, IntWritable> {

    private IntWritable one = new IntWritable(1);
    private IntWritable negone = new IntWritable(-1);
    private IntWritable inDegreeNode = new IntWritable();
    private IntWritable outDegreeNode = new IntWritable();
    
    public void map(Object key, Text value, Context context)
        throws IOException, InterruptedException {

      String[] tuple = value.toString().split("\t", -1);
      // System.out.println("Tuple contains: " + tuple[0] + " " + tuple[1] + " " + tuple[2]);
      Integer source = Integer.parseInt(tuple[0]);
      Integer target = Integer.parseInt(tuple[1]);
      inDegreeNode.set(target);
      outDegreeNode.set(source);
      context.write(inDegreeNode, negone);
      context.write(outDegreeNode, one);
    }
  }

  public static class DegreeDifferenceKeyMapper
      extends Mapper<LongWritable, Text, IntWritable, IntWritable> {

    private IntWritable one = new IntWritable(1);
    // private IntWritable tempInDegrees = new IntWritable();
    private IntWritable degreeDifference = new IntWritable();
    
    public void map(LongWritable key, Text value, Context context)
        throws IOException, InterruptedException {

      String[] tuple = value.toString().split("\t", -1);
      // String node = tuple[0];
      Integer degree = Integer.parseInt(tuple[1]);
      degreeDifference.set(degree);
      context.write(degreeDifference, one);
    }
  }

  public static class IntSumReducer
      extends Reducer<IntWritable, IntWritable, IntWritable, IntWritable> {

    private IntWritable result = new IntWritable();

    public void reduce(IntWritable key, Iterable<IntWritable> values, Context context)
        throws IOException, InterruptedException {
    
      int sum = 0;
      for (IntWritable val : values) {
        sum += val.get();
      }
      result.set(sum);
      context.write(key, result);
    }
  }

  public static void main(String[] args) throws Exception {
    Configuration conf1 = new Configuration();
    Configuration conf2 = new Configuration();

    /* TODO: Needs to be implemented */

    /**
     * Job 1
     * Calculate in and out degrees
     */
    Job job1 = Job.getInstance(conf1, "Q4J1");
    job1.setJarByClass(Q4.class);
    job1.setMapperClass(DegreeDifferenceMapper.class);
    job1.setReducerClass(IntSumReducer.class);
    job1.setOutputKeyClass(IntWritable.class);
    job1.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job1, new Path(args[0]));
    FileOutputFormat.setOutputPath(job1, new Path(tmpPath));
    job1.waitForCompletion(true);

    /**
     * Job 2
     */
    Job job2 = Job.getInstance(conf2, "Q4J2");
    job2.setJarByClass(Q4.class);
    job2.setMapperClass(DegreeDifferenceKeyMapper.class);
    job2.setReducerClass(IntSumReducer.class);
    job2.setOutputKeyClass(IntWritable.class);
    job2.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job2, new Path(tmpPath));
    FileOutputFormat.setOutputPath(job2, new Path(args[1]));
    System.exit(job2.waitForCompletion(true) ? 0 : 1);
  }
}
