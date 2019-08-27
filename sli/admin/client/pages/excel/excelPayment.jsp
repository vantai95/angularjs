<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=payment_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>���� �ٿ�ε�</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
</head>
<body>
    <table style="background: #ffffff">
        <thead>
            <tr>
	            <th>�ֹ���ȣ</th>
	            <th>������</th> 
	            <th>��ü��</th>
	            <th>ID</th>
	            <th>����ó</th>
	            <th>�����</th>  
	            <th>���Ǹ�</th>
	            <th>������</th>
	            <th>������</th>
	            <th>������</th>
	            <th>�����ݾ�</th>
	            <th>��������</th>
	            <th>����</th>
            </tr>
        </thead>
        <tbody>
        	<c:forEach var="x" items="${list}" varStatus="status">
                <tr>
		            <td>${x.orderCd}</td>      
		            <td>${x.studentNm}</td>
		            <td>${x.compNm}</td>
		            <td>${x.userId}</td>
		            <td>${x.mobile}</td>
		            <td>${x.teacherNm}</td>
		            <td>${x.lectureNm}</td>  
		            <td>${x.payDt}</td>
		            <td>${x.startDt}</td>
		            <td>${x.endDt}</td>  
		            <td>${x.payMoney}</td>  
		            <td>${x.payMeansNm}</td>  
		            <td>${x.payStatusNm}</td>
            	</tr>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
