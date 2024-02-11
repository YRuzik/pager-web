proto-win:
	protoc -I=./proto/pager_proto \
	  --js_out=import_style=commonjs,binary:./src/proto \
        --grpc-web_out=import_style=typescript,mode=grpcweb:./src/proto \
      ./proto/pager_proto/chat/chat_actions.proto \
      ./proto/pager_proto/common/common.proto ./proto/pager_proto/transfers/item.proto ./proto/pager_proto/transfers/streams.proto