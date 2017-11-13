@ECHO off
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic register_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic login_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic list_files_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic shared_files_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic upload_files_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic setuploadpath_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic getUserDetails_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic makeDirectory_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic starFile_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic addMembers_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic groupShareFileUpload_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic listGroupMembers_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic listGroupFiles_request
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 0 --topic saveDirectory_request