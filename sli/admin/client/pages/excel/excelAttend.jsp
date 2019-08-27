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
    response.setHeader("Content-Disposition", "attachment; filename=attend_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>엑셀 다운로드</title>
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
    	<tbody>
    		<tr>
    			<th>평균출석율</th>
    			<td>${scheduleList.totalAttendAvg}%</td>
    		</tr>
    		<tr>
    			<th>기간</th>
    			<td colspan="2">${scheduleList.startDt} ~ ${scheduleList.endDt}</td>
    		</tr>
        	<c:forEach var="x" items="${scheduleList.scheduleTime}" varStatus="status">
    		<tr>
    			<th></th>
    			<td colspan="2">(${x.scheduleWeekKor } ${x.scheduleStartTime}~ ${x.scheduleEndTime})</td>
    		</tr>
    		</c:forEach>
    		<tr>
    			<th></th>
    		<tr>
    		<tr>
    			<td colspan="5">
    				O 출석   X 결석   △  지각   ◎  출석인정   ☆  보장성   B 출장-공무   V 휴가   P 기타 개인 사유
    			</td>
    		</tr>
    		<tr>
    			<th></th>
    		<tr>
    		<tr>
    			<th>수강생</th>
    			<c:forEach var="x" items="${studentList}" varStatus="status">
    				<td style="text-align:center">${x.studentNm}</td>
    			</c:forEach>
    		</tr>
    		<tr>
    			<th>출석율</th>
    			<c:forEach var="x" items="${studentList}" varStatus="status">
    				<td style="text-align:center">${x.attendRate}</td>
    			</c:forEach>
    		</tr>
    		<c:forEach var="x" items="${attendList }" varStatus="status">
    			<tr>
    				<th>${x.attDate} (${x.attWeek})</th>
	    			<c:forEach var="y" items="${studentList}" varStatus="status">
	    				<td style="text-align:center">${x[y.stCd]}</td>
	    			</c:forEach>
    			</tr>
    		</c:forEach>
        </tbody>
    </table>
 
</body>
</html>
